import { VStack } from '@chakra-ui/react';
import colors from 'theme/foundations/colors';
import React, { useState } from "react";
import { HStack, Icon, Text, useBreakpointValue, useDisclosure, Drawer } from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { IPCFile } from 'types/types';

type LogsInfo = {
	title: string;
};

const Logs = ({ title }: LogsInfo): JSX.Element => {

        const [showCardLogs, setShow] = useState(0)
        const toggleFct = () => {
            if (showCardLogs === 0)
                setShow(1)
            else
                setShow(0)
        }

        if (showCardLogs === 0)
            return(<button onClick={toggleFct}> Show logs </button>)

        if (showCardLogs === 1) {
            <button onClick={toggleFct}> Hide logs</button>
            const { isOpen, onOpen, onClose } = useDisclosure();
	        const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

	        return (
	        	<HStack
	        		spacing={isDrawer ? '24px' : '12px'}
	        		p="8px 12px"
	        		borderRadius="8px"
	        		role="group"
	        		onClick={onOpen}
	        		w="100%"
	        		cursor="pointer"
	        		_hover={{
	        			bg: 'blue.100',
	        		}}
	        	>
	        		<Icon
	        			as={AiOutlineInfoCircle}
	        			_groupHover={{ color: 'red.800' }}
	        			w={isDrawer ? '24px' : '20px'}
	        			h={isDrawer ? '24px' : '20px'}
	        		/>
	        		<Text
	        			fontSize="16px"
	        			fontWeight="400"
	        			_groupHover={{
	        				color: 'red.800',
	        				fontWeight: '500',
	        			}}
	        		>
	        			Details
	        		</Text>
	        	</HStack>
	        );
            // return (
            //     <>
            //         <div className="cardContainer" style={{
            //             width:"400px",
            //             height:"600px",
            //             overflow: "hidden",
            //             boxShadow: "15px 15px 15px -7px",
            //             textAlign:"center",
            //             color: "purple",
            //             backgroundColor:"white",
            //             position:"absolute",
            //             right:"-815px",
            //             padding: "30px 30px 30px 30px",
            //             borderRadius: "20px",
            //             margin: "130px 20px 0px 0px"}}>
            //             <VStack textAlign="center" w="100%">
            //                 <Text
	        // 	    			fontSize={{ base: '16px', sm: '24px' }}
	        // 	    			fontWeight="bold"
	        // 	    			bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
	        // 	    			bgClip="text"
	        // 	    			id="logs-title">
	        // 	    		    Logs
	        // 	    		</Text>
	        // 	    	</VStack>
            //         </div>
            //     </>
            // )
        }
		return <></>
}

export default Logs