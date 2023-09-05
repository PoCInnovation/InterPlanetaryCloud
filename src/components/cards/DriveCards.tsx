import {VStack} from '@chakra-ui/react';

import type {IPCContact, IPCFile, IPCFolder, IPCProgram} from 'types/types';

import ContactCard from './ContactCard';
import FileCard from './FileCard';
import FolderCard from './FolderCard';
import PathCard from './PathCard';
import ProgramCard from './ProgramCard';

type DriveCardsProps = {
    files?: IPCFile[];
    folders?: IPCFolder[];
    programs?: IPCProgram[];
    contacts?: IPCContact[];
};

const DriveCards = ({files, folders, programs, contacts}: DriveCardsProps): JSX.Element => (
        <VStack w="100%">
            <PathCard/>
            {folders?.map((folder) => (
                <FolderCard folder={folder} key={folder.createdAt}/>
            ))}
            {files?.map((file) => (
                <FileCard file={file} key={file.id}/>
            ))}
            {programs?.map((program) => (
                <ProgramCard program={program} key={program.createdAt}/>
            ))}
            {contacts?.map((contact) => (
                <ContactCard contact={contact} key={contact.address}/>
            ))}
        </VStack>
    )

export default DriveCards;
