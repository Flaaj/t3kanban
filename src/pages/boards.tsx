import { FC, MouseEventHandler, useContext, useMemo, useState } from "react";

import { Form, Formik } from "formik";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Button from "src/components/Button";
import Container from "src/components/Container";
import DeleteButton from "src/components/DeleteButton";
import TextInput from "src/components/TextInput";
import ModalWindow, { ModalContext } from "src/components/ModalWindow";
import * as Yup from "yup";

import { Board, TaskStatus } from "@prisma/client";

import { trpc } from "../utils/trpc";

const Boards: NextPage = () => {
  const boards = trpc.useQuery(["boards.getAll"]);

  console.log(boards.data);

  return (
    <>
      <Head>
        <title>Boards | Flaaj Kanban Board</title>
        <meta name="description" content="A fullstack kanban app made with t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-2">
          {boards.data?.map((board) => (
            <BoardThumbnail key={board.id} {...board} />
          ))}
          <AddNewBoardButton />
        </div>
      </Container>
    </>
  );
};

export default Boards;

interface IBoardThumbnail extends Board {
  tasks: { status: TaskStatus }[];
}

const BoardThumbnail: FC<IBoardThumbnail> = ({ name, id, tasks }) => {
  const utils = trpc.useContext();

  const countedTasks = useMemo(() => {
    let totalAmountOfTasks = 0;
    const taskCountsByStatus: { [key in TaskStatus]: number } = {
      BACKLOG: 0,
      TODO: 0,
      IN_PROGRESS: 0,
      ICE_BOXED: 0,
      TESTING: 0,
      DONE: 0,
    };

    tasks.forEach((task) => {
      taskCountsByStatus[task.status]++;
      totalAmountOfTasks++;
    });

    return { ...taskCountsByStatus, total: totalAmountOfTasks };
  }, [tasks]);

  const removeBoard = trpc.useMutation(["boards.remove"], {
    onSuccess() {
      utils.invalidateQueries("boards.getAll");
    },
  });

  const deleteBoard: MouseEventHandler = (e) => {
    e.preventDefault();
    if (!confirm("Do you want to delete this board?")) return;
    removeBoard.mutate({ id });
  };

  return (
    <Link href={`/board/${id}`}>
      <a className="flex flex-col p-4 rounded-xl bg-teal-200 h-full w-full shadow-lg border border-teal-400">
        <h2 className="font-bold text-lg text-stone-800 mb-3">{name}</h2>
        <h3 className="font-medium leading-5 mb-2">
          Total tasks: <span className="font-normal">{countedTasks.total}</span>
        </h3>
        <h3 className="font-medium leading-5">
          Backlog: <span className="font-normal">{countedTasks.BACKLOG}</span>
        </h3>
        <h3 className="font-medium leading-5">
          Todo: <span className="font-normal">{countedTasks.TODO}</span>
        </h3>
        <h3 className="font-medium leading-5">
          Ice boxed: <span className="font-normal">{countedTasks.ICE_BOXED}</span>
        </h3>
        <h3 className="font-medium leading-5">
          In progress: <span className="font-normal">{countedTasks.IN_PROGRESS}</span>
        </h3>
        <h3 className="font-medium leading-5">
          Testing: <span className="font-normal">{countedTasks.TESTING}</span>
        </h3>
        <h3 className="font-medium leading-5">
          Done: <span className="font-normal">{countedTasks.DONE}</span>
        </h3>
        <DeleteButton onClick={deleteBoard} />
      </a>
    </Link>
  );
};

const AddNewBoardButton = () => {
  const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsNewBoardModalOpen(true)}
        className="group p-4 rounded-xl bg-teal-100 hover:bg-teal-200 h-full w-full grid place-items-center transition"
      >
        <span className="rounded-full pt-1 block w-20 h-20 text-6xl text-opacity-40 text-black group-hover:bg-sky-400 group-hover:bg-opacity-30 transition duration-300">
          +
        </span>
      </button>

      <ModalWindow isOpen={isNewBoardModalOpen} handleClose={() => setIsNewBoardModalOpen(false)}>
        <NewBoardForm />
      </ModalWindow>
    </>
  );
};

const NewBoardForm = () => {
  const utils = trpc.useContext();
  const { closeModal } = useContext(ModalContext);
  const addNewBoard = trpc.useMutation(["boards.create"], {
    onSuccess: () => {
      utils.invalidateQueries(["boards.getAll"]);
      closeModal();
    },
  });

  return (
    <Formik
      initialValues={{ name: "" }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Please, add a name for your new board")
          .min(5, "Board name must consist of at least 5 letters"),
      })}
      onSubmit={async ({ name }) => {
        addNewBoard.mutate({ name });
      }}
    >
      <Form className="bg-gray-100 p-8 rounded-lg border border-gray-300">
        <h3 className="font-bold text-center text-2xl">Add New Board</h3>
        <TextInput //
          name="name"
          label="Board name"
          placeholder="New board name..."
        />
        <Button variant="filled" type="submit">
          Add
        </Button>
      </Form>
    </Formik>
  );
};
