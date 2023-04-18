import React, { useState } from 'react'
import Helmet from '../components/Helmet/Helmet'
import { Container, Col, Row, Form, FormGroup } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.config'
import { toast } from 'react-toastify'
import { async } from '@firebase/util'
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { doc, getDocs, setDoc,collection } from 'firebase/firestore';
import { db, storage } from "../firebase.config";


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const signIn = async (e) => {

    e.preventDefault()
    setLoading(true)
    try {

      const userCredential = await signInWithEmailAndPassword(auth, email,
        password);

      const user = userCredential.user
      setLoading(false)
      toast.success('Succesfully logged in!')

      const querySnapshot = await getDocs(collection(db, "users", user.uid, "cart"));
      querySnapshot.forEach((doc) => {

        dispatch(cartActions.addItem({
          ...doc.data()
        }));

      });

      console.log("cart loaded");
      navigate('/checkout')

    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  return (<Helmet title='Login'>
    <section>
      <Container>
        <Row>
          {
            loading ? <Col lg='12' className='text-center' ><h5 className='fw-bold'>Loading...</h5></Col> :
              <Col lg='6' className='m-auto text-center'>
                <h3 className='fw-bold mb-4'>Login</h3>

                <Form className='auth__form' onSubmit={signIn}>
                  <FormGroup className='form__group'>
                    <input type="email" placeholder='Enter Your email'
                      value={email} onChange={e => setEmail(e.target.value)} />
                  </FormGroup>

                  <FormGroup className='form__group'>
                    <input type="password" placeholder='Enter Your password'
                      value={password} onChange={e => setPassword(e.target.value)} />
                  </FormGroup>

                  <button type="submit" className="buy__btn aut__btn">Login</button>
                  <p>Don't have an account?   <Link to='/Signup'>Create an account</Link></p>
                </Form>
              </Col>
          }
        </Row>
      </Container>
    </section>
  </Helmet>
  )
};

export default Login