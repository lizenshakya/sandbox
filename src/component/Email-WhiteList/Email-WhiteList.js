import { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const EmailWhiteList = () => {
    const [email, setEmail] = useState();
    const [site, setSite] = useState();
    const [message, setMesssage] = useState();
    const [error, setError] = useState(false);

    const emailValidation = () => {
        const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
        if (email && regex.test(email)) {
            setError(false);
            setMesssage('')
            return true;
        }
        setError(true);
        setMesssage('Wrong email')
        return false;
    }

    const clear = () => {
        setEmail('');
        setSite('')
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        let apiUrl = ''
        if (emailValidation()) {
            switch (site) {
                case 'dev':
                    apiUrl = 'https://dev-api.yorba.app/v1/email-whitelist'
                    break;
                case 'prod':
                    apiUrl = 'https://staging-api.yorba.app/v1/email-whitelist'
                    break;
                case 'staging':
                    apiUrl = 'https://api.yorba.app/v1/email-whitelist'
                    break;
                default:
                    setError(true);
                    setMesssage('Please select site')
                    break
            }
            if (!site) {
                return
            }
            const data = await axios.post(apiUrl, {
                email,
                code: 'justgetthehelloutofhere'
            });
            if (data && (data.status === 200 || data.status === 201)) {
                e.target.reset()
                setMesssage('Success')
            } else {
                setError(true);
                setMesssage('Error')
            }
            clear();
        } else {
            setError(true);
            setMesssage('Wrong email')
        }
    }
    return (
        <div className='container'>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Site</Form.Label>
                    <Form.Select aria-label="Default select example" required onChange={(e) => setSite(e.target.value)}>
                        <option value="dev">Dev</option>
                        <option value="staging">Staging</option>
                        <option value="prod">Prod</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>

            {message ? message : ''}
        </div>
    )
};

export default EmailWhiteList;