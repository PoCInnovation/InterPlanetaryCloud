import { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useUserContext } from 'contexts/user';
import type { IPCFile } from 'types/types';

type MoveFileButtonsProps = {
  file: IPCFile;
  isUpdateLoading: boolean;
  setSelectedFile: (file: IPCFile) => void;
  onOpenMoveFile: () => void;
};

const MoveFileButtons = ({
  file,
  isUpdateLoading,
  setSelectedFile,
  onOpenMoveFile,
}: MoveFileButtonsProps): JSX.Element => {
  const { user } = useUserContext();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const permission = user.contact.hasEditPermission(file.hash);
    setHasPermission(permission.success);
  }, []);

  if (!hasPermission) return <></>;

  return (
    <>
      <Button
        variant="inline"
        size="sm"
        w="100%"
        p="0px"
        mx="4px"
        onClick={async () => {
          setSelectedFile(file);
          onOpenMoveFile();
        }}
        isLoading={isUpdateLoading}
        id="ipc-dashboard-move-filebutton"
      >
        Move
      </Button>
    </>
  );
};

export default MoveFileButtons;
