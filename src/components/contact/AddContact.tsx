import {Input, useDisclosure, useToast} from '@chakra-ui/react';
import EthCrypto from 'eth-crypto';
import {ChangeEvent, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';

import Button from 'components/Models/Button';
import Modal from 'components/Models/Modal';

import {useDriveContext} from 'contexts/drive';
import {useUserContext} from 'contexts/user';

const AddContact = (): JSX.Element => {
  const {user} = useUserContext();
  const {setContacts} = useDriveContext();
  const toast = useToast({duration: 2000, isClosable: true});

  const [name, setName] = useState('');
  const [contactPublicKey, setContactPublicKey] = useState('');
  const {isOpen, onOpen, onClose} = useDisclosure();

  const addContact = async () => {
    try {
      if (name && contactPublicKey) {
        const address = EthCrypto.publicKey.toAddress(contactPublicKey.slice(2));
        const add = await user.fullContact.manage.add({
          name,
          address,
          publicKey: contactPublicKey,
          createdAt: new Date().getTime(),
          files: [],
          folders: [],
          config: undefined,
          programs: [],
        });

        toast({title: add.message, status: add.success ? 'success' : 'error'});
        setContacts(user.fullContact.contact.contacts);
      } else {
        toast({title: 'Bad contact infos', status: 'error'});
      }
      setName('');
      onClose();
    } catch (error) {
      console.error(error);
      toast({title: 'Bad public key given', status: 'error'});
    }
  };

  return (
    <>
      <Button buttonType="left-icon" icon={BsPlusLg} size="lg" variant="primary" onClick={onOpen}>
        Add a contact
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add a contact"
        CTA={
          <Button variant="primary" size="lg" onClick={addContact} id="ipc-dashboard-add-contact-button">
            Add a contact
          </Button>
        }
      >
        <>
          <Input
            type="text"
            w="100%"
            p="10px"
            my="4px"
            placeholder="Name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            id="ipc-dashboard-input-contact-name"
          />
          <Input
            type="text"
            w="100%"
            p="10px"
            my="4px"
            placeholder="Public Key"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setContactPublicKey(e.target.value)}
            id="ipc-dashboard-input-contact-public-key"
          />
        </>
      </Modal>
    </>
  );
};

export default AddContact;
