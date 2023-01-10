import {
  Button,
  Container,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FirestoreService } from "../firebase/firestoreService";
import { FormTodo } from "./FormTodo";

const TableTodoServices = new FirestoreService("todos");
export function Dashboard() {
  const [todos, setTodos] = useState([]);
  async function getTodos() {
    try {
      let res = await TableTodoServices.getAll();
      setTodos(res);
    } catch (error) {}
  }

  useEffect(() => {
    getTodos();
  }, []);

  async function markTodo(status, id, data) {
    const newData = data;
    newData.status = status;
    try {
      await TableTodoServices.update(id, newData);
    } catch (error) {
    } finally {
      getTodos();
    }
  }

  async function remove(id) {
    try {
      await TableTodoServices.delete(id);
    } catch (error) {
    } finally {
      getTodos();
    }
  }

  async function changePriority(id, data, priority) {
    const newData = data;
    newData.priority = priority;
    try {
      await TableTodoServices.update(id, newData);
    } catch (error) {
    } finally {
      getTodos();
    }
  }

  return (
    <Container maxW="container.xl" className="m">
      <br />
      <FormTodo refresh={getTodos} />
      <br />

      <Divider />
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Title</Th>
              <Th>Priority</Th>
              <Th>Created At</Th>
              <Th>Due date At</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {todos?.map((item, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{item?.title}</Td>
                <Td>
                  {!item?.status && (
                    <Button
                      onClick={() =>
                        changePriority(
                          item?.id,
                          item,
                          Number(item?.priority) - 1
                        )
                      }
                    >
                      Down
                    </Button>
                  )}{" "}
                  {item?.priority}{" "}
                  {!item?.status && (
                    <Button
                      onClick={() =>
                        changePriority(
                          item?.id,
                          item,
                          Number(item?.priority) + 1
                        )
                      }
                    >
                      Up
                    </Button>
                  )}
                </Td>
                <Td>{item?.createdAt}</Td>
                <Td>{item?.due_date}</Td>
                <Td>{item?.status ? "Done" : "Todo"}</Td>
                <Td>
                  {item?.status ? (
                    <Button onClick={() => markTodo(false, item?.id, item)}>
                      Mark as todo
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => markTodo(true, item?.id, item)}>
                        Mark as done
                      </Button>
                      <Button onClick={() => remove(item?.id)}>Remove</Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
