import React, { FC, MouseEventHandler, useContext, useMemo, useState } from "react";

import { Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import Button from "src/components/Button";
import DeleteButton from "src/components/DeleteButton";
import EditableText from "src/components/EditableText";
import FormikTextInput from "src/components/FormikTextInput";
import ModalWindow, { ModalContext } from "src/components/ModalWindow";
import SelectInput from "src/components/SelectInput";
import arrayFromEnum from "src/utils/arrayFromEnum";
import capitalizeString from "src/utils/capitalize";
import { trpc } from "src/utils/trpc";
import * as Yup from "yup";

import { Task, TaskStatus } from "@prisma/client";

const Board = () => {
  const router = useRouter();
  const tasks = trpc.useQuery(["tasks.getAll", { boardId: router.query.boardId as string }]);

  const tasksByStatus = useMemo(() => {
    const object: { [key in TaskStatus]: Task[] } = {
      BACKLOG: [],
      TODO: [],
      IN_PROGRESS: [],
      ICE_BOXED: [],
      TESTING: [],
      DONE: [],
    };

    if (!tasks.data) return object;

    tasks.data.forEach((task) => {
      const TaskStatus = task.status as TaskStatus;
      object[TaskStatus].push(task);
    });

    return object;
  }, [tasks.data]);

  if (tasks.isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <Head>
        <title>Board | Flaaj Kanban Board</title>
        <meta name="description" content="A fullstack kanban app made with t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-6 w-[1800px] gap-6 h-full">
        <BoardColumn //
          label="Backlog"
          status={TaskStatus.BACKLOG}
          todos={tasksByStatus.BACKLOG}
        />
        <BoardColumn //
          label="Todo"
          status={TaskStatus.TODO}
          todos={tasksByStatus.TODO}
        />
        <BoardColumn //
          label="In progress"
          status={TaskStatus.IN_PROGRESS}
          todos={tasksByStatus.IN_PROGRESS}
        />
        <BoardColumn //
          label="Ice boxed"
          status={TaskStatus.ICE_BOXED}
          todos={tasksByStatus.ICE_BOXED}
        />
        <BoardColumn //
          label="Testing"
          status={TaskStatus.TESTING}
          todos={tasksByStatus.TESTING}
        />
        <BoardColumn //
          label="Done"
          status={TaskStatus.DONE}
          todos={tasksByStatus.DONE}
        />
      </div>
    </>
  );
};

export default Board;

interface IBoardColumn {
  label: string;
  status: TaskStatus;
  todos: Task[];
}

const BoardColumn: FC<IBoardColumn> = ({ todos, label, status }) => {
  return (
    <div className="bg-red-100 p-4 rounded-2xl h-full grid grid-rows-[auto,_1fr] shadow-xl">
      <h3 className="uppercase text-center font-bold tracking-widest mb-4">{label}</h3>
      <ul className="h-full">
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2 last:mb-0">
            <TodoCard {...todo} status={todo.status as TaskStatus} />
          </li>
        ))}
        <AddNewTaskButton status={status} />
      </ul>
    </div>
  );
};

export interface ITodoCard extends Task {}

const TodoCard: FC<ITodoCard> = ({ id, name, description, status }) => {
  const utils = trpc.useContext();
  const removeTask = trpc.useMutation(["tasks.remove"], { onSuccess: () => utils.refetchQueries(["tasks.getAll"]) });
  const changeStatus = trpc.useMutation(["tasks.update"], { onSuccess: () => utils.refetchQueries(["tasks.getAll"]) });

  const handleRemoveTask: MouseEventHandler = (e) => {
    e.preventDefault();
    if (!confirm("Do you want to delete this task?")) return;
    removeTask.mutate({ id });
  };

  const onTaskStatusChange = (status: TaskStatus) => {
    changeStatus.mutate({ id, status });
  };

  return (
    <div className="flex flex-col p-3 rounded-lg bg-sky-200 drop-shadow-md w-full border border-sky-400">
      <Formik
        initialValues={{ name, description }}
        onSubmit={({ name, description }) => changeStatus.mutate({ id, name, description })}
      >
        <Form>
          <EditableText className="font-bold pb-2 mb-1 border-b border-sky-300" name="name" variant="input" tag="h4">
            {name}
          </EditableText>
          <EditableText
            className="text-xs py-4 w-full break-all whitespace-pre-wrap"
            name="description"
            variant="textarea"
            tag="p"
          >
            {description}
          </EditableText>
        </Form>
      </Formik>

      <SelectInput
        className="pb-4 border-b border-sky-300 rs_m:relative"
        defaultValue={{
          value: status,
          label: capitalizeString(status.replace(/_/g, " ")),
        }}
        options={arrayFromEnum(TaskStatus).map((value) => ({
          value,
          label: capitalizeString(value.replace(/_/g, " ")),
        }))}
        onChange={(option) => onTaskStatusChange(option!.value as TaskStatus)}
      />

      <DeleteButton onClick={handleRemoveTask} />
    </div>
  );
};

interface IAddNewTaskButton {
  status: TaskStatus;
}

const AddNewTaskButton: FC<IAddNewTaskButton> = ({ status }) => {
  const router = useRouter();
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsNewTaskModalOpen(true)}
        className="group p-4 rounded-xl bg-orange-100 hover:bg-orange-200 h-full w-full grid place-items-center transition max-h-28"
      >
        <span className="rounded-full pt-1 block w-20 h-20 text-6xl text-opacity-40 text-black group-hover:bg-orange-300 group-hover:bg-opacity-30 transition duration-300">
          +
        </span>
      </button>

      <ModalWindow //
        isOpen={isNewTaskModalOpen}
        handleClose={() => setIsNewTaskModalOpen(false)}
      >
        <NewTaskForm status={status} boardId={router.query.boardId as string} />
      </ModalWindow>
    </>
  );
};
interface INewTaskForm {
  className?: string;
  boardId: string;
  status: TaskStatus;
}

const NewTaskForm: FC<INewTaskForm> = ({ className, boardId, status }) => {
  const utils = trpc.useContext();
  const { closeModal } = useContext(ModalContext);
  const addNewTask = trpc.useMutation(["tasks.create"], {
    onSuccess: () => {
      utils.invalidateQueries(["tasks.getAll"]);
      closeModal();
    },
  });

  return (
    <Formik
      initialValues={{ name: "", description: "" }}
      validationSchema={Yup.object().shape({
        name: Yup.string() //
          .required("Please, add a name for your new task"),
        description: Yup.string() //
          .required("Please, add a description for your new task"),
      })}
      onSubmit={async ({ name, description }) => {
        addNewTask.mutate({ name, description, status, boardId });
      }}
    >
      <Form className="bg-gray-100 p-8 rounded-lg border border-gray-300">
        <h3 className="font-bold text-center text-2xl">Add New Task</h3>
        <FormikTextInput //
          name="name"
          label="Task name"
          placeholder="New task name..."
        />
        <FormikTextInput //
          name="description"
          label="Task description"
          placeholder="New board description..."
        />
        <Button variant="filled" type="submit">
          Add
        </Button>
      </Form>
    </Formik>
  );
};
