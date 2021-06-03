import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Buttons from '../components/testConfigComponents/buttonsstartstop';
import TargetInputs from '../components/testConfigComponents/TargetInputs';
import RangeSliders from '../components/testConfigComponents/RangeSliders';

interface TestConfigData {
    rpsInterval: number;
    startRPS: number;
    endRPS: number;
    testLength: number;
    inputsData: {
        method: string;
        targetURL: string;
        percentage: number[];
        jagTesterEnabled: boolean;
    }[];
}

//---------------------------- suppoerted http methods
const HTTPMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    HEAD: 'HEAD',
    CONNECT: 'CONNECT',
    TRACE: 'TRACE',
};

const TestPage: () => JSX.Element = () => {
    // states for rps sliders
    const [valueRPS, setValueRPS] = React.useState<number[]>([25]);
    const [valueStartEnd, setValueStartEnd] = React.useState<number[]>([100, 1500]);
    const [valueSeconds, setValueSeconds] = React.useState<number[]>([2]);

    // state for the inputs
    const [inputsData, setInputsData] = React.useState([
        {
            method: HTTPMethods.GET,
            targetURL: 'http://localhost:',
            percentage: [20],
            jagTesterEnabled: false,
        },
        {
            method: HTTPMethods.GET,
            targetURL: 'http://localhost:',
            percentage: [80],
            jagTesterEnabled: false,
        },
    ]);

    const handleStartTest = () => {
        const testConfigObj: TestConfigData = {
            rpsInterval: valueRPS[0],
            startRPS: valueStartEnd[0],
            endRPS: valueStartEnd[1],
            testLength: valueSeconds[0],
            inputsData,
        };
        fetch('/api/start', {
            method: HTTPMethods.POST,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(testConfigObj),
        })
            .then((res) => res.json())
            .then((data) => console.log(data)) // TODO if not jagtester enabled, show error message
            .catch((err) => console.log(err)); // TODO fix the error handling

        // console.log(testConfigObj);
    };

    return (
        <Row>
            <Col>
                <TargetInputs inputsData={inputsData} setInputsData={setInputsData} HTTPMethods={HTTPMethods} />
            </Col>
            <Col>
                <Tabs defaultActiveKey="load-tester" className="mb-4">
                    <Tab eventKey="load-tester" title="Load tester">
                        <RangeSliders
                            valueRPS={valueRPS}
                            valueStartEnd={valueStartEnd}
                            valueSeconds={valueSeconds}
                            setValueRPS={setValueRPS}
                            setValueStartEnd={setValueStartEnd}
                            setValueSeconds={setValueSeconds}
                        />
                        <Buttons
                            isDisabled={inputsData.some((target) => !target.jagTesterEnabled)}
                            handleStartTest={handleStartTest}
                        />
                    </Tab>
                    <Tab eventKey="stress-tester" title="Stress tester">
                        stress tester
                    </Tab>
                </Tabs>
            </Col>
        </Row>
    );
};

export default TestPage;
