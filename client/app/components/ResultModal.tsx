"use client";

import { title } from "@/components/primitives";
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

type ResultModalProps = {
  open: boolean;
};

const ResultModal: React.FC<ResultModalProps> = ({ open }) => {
  return (
    <Modal
      isOpen={open}
      backdrop="blur"
      isDismissable={false}
      hideCloseButton={true}
      size="2xl"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col items-center pt-7">
              <h1 className={title({ size: "md", color: "violet" })}>
                Quiz result
              </h1>
            </ModalHeader>
            <ModalBody className="my-5">
              <Table removeWrapper aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>RANK</TableColumn>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>SCORE</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>1</TableCell>
                    <TableCell>Tony Reichert</TableCell>
                    <TableCell>11/15</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter className="flex flex-col items-center">
              <Link href="/single">
                <Button color="primary">Replay</Button>
              </Link>
              <Link href="/">
                <Button color="primary" variant="light">
                  Back to the menu
                </Button>
              </Link>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ResultModal;