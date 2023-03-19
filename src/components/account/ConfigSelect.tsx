import React from 'react';
import {HStack} from "@chakra-ui/react";
import Button from 'components/Button';
import { useConfigContext } from "../../contexts/config";

const ConfigInputModal = ({ option, isLoading, onClick }: {
    option: string;
    isLoading: boolean,
    onClick: (key: string, value: string) => Promise<void>;
}): JSX.Element => {
    const { config } = useConfigContext();
    const configOption = config![option];

    if (configOption.type !== "select")
        return <></>;

    return (
        <HStack key={`${configOption.name}-select`} spacing="16px">
            {configOption.options.map((optionValue) => (
                <Button
                    key={`${configOption.name}-select-${optionValue}`}
                    variant={configOption.value === optionValue ? 'primary' : 'secondary'}
                    disabled={configOption.value === optionValue}
                    isLoading={isLoading}
                    onClick={() => {
                        onClick("theme", optionValue);
                    }}
                    size="md"
                >
                    {`${optionValue} ${configOption.name}`}
                </Button>
            ))}
        </HStack>
    )
};

export default ConfigInputModal;
