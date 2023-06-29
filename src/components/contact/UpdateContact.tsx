import {EditIcon} from '@chakra-ui/icons';
import {FormControl, FormLabel, Input, useColorModeValue, useDisclosure, useToast} from '@chakra-ui/react';
import {ChangeEvent, useState} from 'react';

import Modal from 'components/Models/Modal';

import type {IPCContact} from 'types/types';

import {useDriveContext} from 'contexts/drive';
import {useUserContext} from 'contexts/user';
import Button from 'components/Models/Button';
import {textColorMode} from 'config/colorMode';

type UpdateContactProps = {
  contact: IPCContact;
};

const UpdateContact = ({contact}: UpdateContactProps): JSX.Element => {
  const {user} = useUserContext();
  const {setContacts} = useDriveContext();
  const toast = useToast({duration: 2000, isClosable: true});
  const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();

  const updateContact = async () => {
    setIsLoading(true);
    if (name) {
      const update = await user.fullContact.manage.update(contact.address, name);
      toast({title: update.message, status: update.success ? 'success' : 'error'});
      setContacts(user.fullContact.contact.contacts);
    } else {
      toast({title: 'Invalid name', status: 'error'});
    }
    setName('');
    setIsLoading(true);
    onClose();
  };

  return (
    <>
      <Button size="sm" w="100%" p="0px" mx="4px" onClick={() => onOpen()}>
        <EditIcon/>
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Update the contact"
        CTA={
          <Button
            variant="primary"
            size="lg"
            onClick={updateContact}
            isLoading={isLoading}
            id="ipc-dashboard-update-contact-button"
          >
            Update the contact
          </Button>
        }
      >
        <FormControl>
          <FormLabel color={textColor}>New name</FormLabel>
          <Input
            type="text"
            w="100%"
            p="10px"
            my="4px"
            placeholder={contact.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            id="ipc-dashboard-input-contact-name"
          />
        </FormControl>
      </Modal>
    </>
  );
};

export default UpdateContact;
