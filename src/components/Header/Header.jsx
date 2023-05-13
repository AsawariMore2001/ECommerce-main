import React, { useRef, useEffect } from 'react';
import './header.css';
import { Container, Row } from 'reactstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/images/eco-logo.png';
import userIcon from '../../assets/images/user-icon.png';

// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { storage } from '../firebase.config';

import { useSelector } from 'react-redux';
import useAuth from '../../custom-hooks/useAuth';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { toast } from 'react-toastify';

import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

const nav__links = [
    {
        path: 'home',
        display: 'Home'
    },
    {
        path: 'shop',
        display: 'Shop'
    },
    {
        path: 'cart',
        display: 'Cart'
    },
    {
        path: 'myorders',
        display: 'My Orders'
    }

]

const Header = () => {

    const totalQuantity = useSelector(state => state.cart.totalQuantity);
    const dispatch = useDispatch();
    const headerRef = useRef(null);

    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { currentUser } = useAuth()
    const profileActionRef = useRef(null)
    const inputFile = useRef(null)

    const stickyHeaderFunc = () => {
        // window.addEventListener('scroll', () => {
        //     if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        //         headerRef.current.classList.add('sticky__header')
        //     }
        //     else {
        //         headerRef.current.classList.remove('sticky__header')
        //     }

        // });
    };
    const logout = () => {

        dispatch(cartActions.emptyCart({}));
        signOut(auth).then(() => {
            toast.success('Logged out')
            navigate('/home')
        }).catch(err => {
            toast.error(err.message)
        })

    }
    const logIn = () => {
        navigate('/login');
    }
    const dashboard = () => {
        navigate('/dashboard');
    }
    const signUp = () => {
        navigate('/signup');
    }

    const changeProfilePhoto = () => {

        //     // `current` points to the mounted file input element
        //     inputFile.current.click();

        //     const storageRef = ref(storage, `images/₹{Date.now() + username}`)
        //   const uploadTask = uploadBytesResumable(storageRef, file)
        //   uploadTask.on('state_changed',
        //     (error) => {
        //       console.log(error)
        //     },
        //     () => {
        //       getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
        //         await updateProfile(currentUser, {
        //           displayName: username,
        //           photoURL: url
        //         })
        //         await updateDoc(doc(db, 'users', user.uid), {
        //           photoURL: url
        //         })
        //       });
        //     }
        //   );


    }
    useEffect(() => {
        stickyHeaderFunc()

        return () => window.removeEventListener('scroll', stickyHeaderFunc)
    });

    const menuToggle = () => menuRef.current.classList.toggle('active__menu');

    const navigateToCart = () => {
        navigate('/cart');
    }

    const toggleProfileActions = () => profileActionRef.current.classList.toggle('show__profileActions');


    return (
        <header className='header' ref={headerRef}>
            <Container>
                <Row>
                    <div className="nav__wrapper">
                        <div className="logo">
                            <img src={logo} alt="logo" />
                            <div>
                                <h1>MultiMart</h1>
                            </div>
                            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} />
                        </div>
                        <div className="navigation" ref={menuRef} onClick={menuToggle}>
                            <motion.ul className="menu">
                                {nav__links.map((item, index) => (
                                    <li className="nav__item" key={index}>
                                        <NavLink
                                            to={item.path}
                                            className={(navClass) =>
                                                navClass.isActive ?
                                                    'nav__active' : ''
                                            }
                                        >
                                            {item.display}
                                        </NavLink>
                                    </li>
                                ))
                                }
                            </motion.ul>
                        </div>
                        <div className="nav__icons">

                            <div>
                                <span className="cart__icon" onClick={navigateToCart}>
                                    <i className="ri-shopping-bag-line"></i>
                                    <span className="badge">{totalQuantity}</span>
                                </span>

                            </div>


                            <div className="profile" onClick={toggleProfileActions}>
                                <motion.img whileTap={{ scale: 1.2 }}
                                    src={currentUser ? currentUser.photoURL ? currentUser.photoURL : userIcon : userIcon}
                                    alt=""
                                />

                                <div
                                    className="profile__action"
                                    ref={profileActionRef}
                                >
                                    {currentUser ? (
                                        <div className='actions'>
                                            {/* <span onClick={changeProfilePhoto}>Profile Photo</span> */}
                                            <span onClick={logout}>Logout</span>
                                            <span onClick={dashboard}>Dashboard</span>

                                        </div>
                                    ) : (
                                        <div className='actions'>


                                            <span onClick={signUp}>Signup</span>
                                            <span onClick={logIn}>Login</span>


                                        </div>
                                    )}


                                </div>
                            </div>
                            <div className="mobile__menu">
                                <span className="fav__icon" onClick={menuToggle}>
                                    <i className="ri-menu-line"></i>
                                </span>
                            </div>
                        </div>

                    </div>
                </Row>
            </Container>
        </header>
    )
}

export default Header