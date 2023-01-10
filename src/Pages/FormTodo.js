import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FirestoreService } from "../firebase/firestoreService";

const TableTodoServices = new FirestoreService("todos");
export function FormTodo({refresh}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    title: "",
    priority: 0,
    due_date: "",
    status: false,
  })

  const initialRef = useRef(null);

  function onChangeForm(key, val) {
    const newData = {...formData, [key]: val,}
    setFormData(newData)
  }

  async function saveTodo() {
    try {
      await TableTodoServices.create(formData)
    } catch (error) {
      console.log("gagal")
    } finally {
      refresh()
      onClose()
    }
  }

  return (
    <>
      <Button onClick={onOpen}>Create Todo</Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input ref={initialRef} value={formData.title} placeholder="Title" onChange={e => onChangeForm("title", e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Priority</FormLabel>
              <Input type="number" value={formData.priority} placeholder="Priority" onChange={e => onChangeForm("priority", e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Due Date</FormLabel>
              <Input type="datetime-local" value={formData.due_date} placeholder="Due date" onChange={e => onChangeForm("due_date", e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveTodo}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
