import React, { FC, MouseEventHandler, useContext, useMemo, useState } from "react";

import { Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import Button from "src/components/Button";
import DeleteButton from "src/components/DeleteButton";
import EditableText from "src/components/EditableText";
import TextInput from "src/components/TextInput";
import ModalWindow, { ModalContext } from "src/components/ModalWindow";
import SelectInput from "src/components/SelectInput";
import arrayFromEnum from "src/utils/arrayFromEnum";
import capitalizeString from "src/utils/capitalize";
import { trpc } from "src/utils/trpc";
import * as Yup from "yup";

import { Task, TaskStatus } from "@prisma/client";

const Board = () => {
  const router = useRouter();
  const { data: tasks } = trpc.useQuery(["tasks.getAll", { boardId: router.query.boardId as string }], {
    select: (tasks) => {
      const tasksByStatus: { [key in TaskStatus]: Task[] } = {
        BACKLOG: [],
        TODO: [],
        IN_PROGRESS: [],
        ICE_BOXED: [],
        TESTING: [],
        DONE: [],
      };
      tasks.forEach((task) => {
        tasksByStatus[task.status].push(task);
      });
      return tasksByStatus;
    },
  });

  if (!tasks) {
    return <>Loading...</>;
  }

  return (
    <>
      <Head>
        <title>Board | Flaaj Kanban Board</title>
        <meta name="description" content="A fullstack kanban app made with t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-6 w-[1800px] gap-6 h-full pt-10">
        {arrayFromEnum(TaskStatus).map((status) => (
          <BoardColumn
            key={status}
            label={capitalizeString(status.replace(/_/g, " "))}
            status={TaskStatus[status]}
            todos={tasks[status] || []}
          />
        ))}
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
    <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl h-full grid grid-rows-[auto,_1fr] shadow-xl">
      <h3 className="uppercase text-center font-bold tracking-widest mb-4">{label}</h3>
      <ul className="h-full">
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2 last:mb-0">
            <TaskCard {...todo} status={todo.status} />
          </li>
        ))}
        <AddNewTaskButton status={status} />
      </ul>
    </div>
  );
};

export interface ITaskCard extends Task {}

const TaskCard: FC<ITaskCard> = ({ id, name, description, status }) => {
  const trpcContext = trpc.useContext();
  const { mutate: removeTask } = trpc.useMutation(["tasks.remove"], {
    onSuccess: () => trpcContext.refetchQueries(["tasks.getAll"]),
  });
  const { mutate: changeStatus } = trpc.useMutation(["tasks.update"], {
    onSuccess: () => trpcContext.refetchQueries(["tasks.getAll"]),
  });

  const handleRemoveTask: MouseEventHandler = (e) => {
    e.preventDefault();
    if (!confirm("Do you want to delete this task?")) return;
    removeTask({ id });
  };

  const onTaskStatusChange = (status: TaskStatus) => {
    changeStatus({ id, status });
  };

  return (
    <div className="flex flex-col p-3 rounded-lg bg-sky-200 drop-shadow-md w-full border border-sky-400">
      <Formik
        onSubmit={({ name, description }) => {
          changeStatus({ id, name, description });
        }}
        initialValues={{ name, description }}
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

const NewTaskForm: FC<INewTaskForm> = ({ boardId, status }) => {
  const { closeModal } = useContext(ModalContext);

  const trpcClient = trpc.useContext();
  const { mutate: addNewTask } = trpc.useMutation(["tasks.create"], {
    onSuccess: () => {
      trpcClient.invalidateQueries(["tasks.getAll"]);
      closeModal();
    },
  });

  return (
    <Formik
      onSubmit={({ name, description }) => {
        addNewTask({ boardId, name, description, status });
      }}
      initialValues={{ name: "", description: "" }}
      validationSchema={Yup.object().shape({
        name: Yup.string() //
          .required("Please, add a name for your new task")
          .min(5, "Task name must consist of at least 5 letters"),
        description: Yup.string() //
          .required("Please, add a description for your new task"),
      })}
    >
      <Form className="bg-gray-100 p-8 rounded-lg border border-gray-300">
        <h3 className="font-bold text-center text-2xl">Add New Task</h3>
        <TextInput //
          name="name"
          label="Task name"
          placeholder="New task name..."
        />
        <TextInput //
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
