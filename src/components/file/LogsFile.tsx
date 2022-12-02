import { Text, VStack } from '@chakra-ui/react';
import colors from 'theme/foundations/colors';
import React, { useState } from "react";

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
            return (
                <>
                    <button onClick={toggleFct}> Hide logs</button>
                    <div className="cardContainer" style={{
                        width:"400px",
                        height:"600px",
                        overflow: "hidden",
                        boxShadow: "15px 15px 15px -7px",
                        textAlign:"center",
                        color: "purple",
                        backgroundColor:"white",
                        position:"absolute",
                        right:"-815px",
                        padding: "30px 30px 30px 30px",
                        borderRadius: "20px",
                        margin: "130px 20px 0px 0px"}}>
                        <VStack textAlign="center" w="100%">
                            <Text
	        	    			fontSize={{ base: '16px', sm: '24px' }}
	        	    			fontWeight="bold"
	        	    			bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
	        	    			bgClip="text"
	        	    			id="logs-title">
	        	    		    Logs
	        	    		</Text>
	        	    	</VStack>
                    </div>
                </>
            )
        }
}

export default Logs