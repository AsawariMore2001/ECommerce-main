import React, { useState, useEffect } from 'react'
import Helmet from '../components/Helmet/Helmet'
import Services from '../services/Services'

import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductsList from '../components/UI/ProductsList'

import counterImg from '../assets/images/counter-timer-img.png'
import Clock from '../components/UI/Clock'
import useGetData from '../custom-hooks/useGetData'

import '../styles/Home.css'
import heroImg from '../assets/images/hero.png'
const Home = () => {

  const {data: products,loading}=useGetData('products')

  const year = new Date().getFullYear();
  const [trendingData, setTrendingData] = useState(products);
  const [bestSalesData, setBestSalesData] = useState(products);
  const [mobileProducts, setMobileProducts] = useState([])
  const [wirelessProducts, setWirelessProducts] = useState([])
  const [popularProducts, setPopularProducts] = useState([])

  useEffect(() => {
    const filteredTrendingProducts = products.filter((item) => item.category === "chair")
    const filteredBestSalesProducts = products.filter((item) => item.category === "sofa")
    const filteredMobileProducts = products.filter((item) => item.category === "mobile")
    const filteredWirelessProducts = products.filter((item) => item.category === "wireless")
    const filteredPopularProducts = products.filter((item) => item.category === "watch")


    setTrendingData(filteredTrendingProducts);
    setBestSalesData(filteredBestSalesProducts);
    setMobileProducts(filteredMobileProducts);
    setWirelessProducts(filteredWirelessProducts);
    setPopularProducts(filteredPopularProducts);
  }, [products]);

  return (
    <Helmet title={"Home"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg='6' md='6'>
              <div className="hero__content">
                <p className="hero__subtitle">Trending Product in {year}</p>
                <h2>Upgrade your life with the latest tech</h2>
                <p>Do you believe in love at first sight or should I refresh this page again? Our collection of gadgets is worth checking out, trust me</p>
                <motion.button whileTap={{ scale: 1.2 }} className="buy__btn"><Link to='/shop'>SHOP NOW</Link></motion.button>
              </div>

            </Col>
            <Col lg='6' md='6'>
              <div className="hero__img">
                <img src={heroImg} alt="hero img" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Services />
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className="section__title">Trending Products</h2>
            </Col>
            {
              loading? <h5 className='fw-bold'>Loading...</h5>:
               <ProductsList data={trendingData} />
            }
           
          </Row>
        </Container>
      </section>
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg='12' className='text-center'>
              <h2 className="section__title">Best Sales</h2>
            </Col>
            {
              loading? <h5 className='fw-bold'>Loading...</h5>:
               <ProductsList data={bestSalesData} />
            }
          </Row>
        </Container>
      </section>

      <section className="timer__count">
        <Container>
          <Row>
            <Col lg='6' md='12' className='count__down-col'>

              <div className="clock__top-content">
                <h4 className='text-white fs-6 mb-2'>
                  Limited Offers
                </h4>
                <h5 className="text-white fs-5 mb-3">
                  Quality Armchair
                </h5>
              </div>
              <Clock />
              <motion.button whileTap={{ scale: 1.2 }} className="buy__btn store__btn">
                <Link to="/shop">
                  Visit Store
                </Link>
              </motion.button>
            </Col>

            <Col lg='6' md='12' className="text-end counter__img">
              <img src={counterImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className='new__arrivals'>
        <Container>
          <Row>
            <Col lg='12' className='text-center mb-5'>
              <h2 className="section__title">New Arrivals</h2>
            </Col>
            {
              loading? <h5 className='fw-bold'>Loading...</h5>:
               <ProductsList data={mobileProducts} />
            }
            {
              loading? <h5 className='fw-bold'>Loading...</h5>:
               <ProductsList data={wirelessProducts} />
            }
          </Row>
        </Container>
      </section>

      <section className='popular_category'>
        <Container>
          <Row>
            <Col lg='12' className='text-center mb-5'>
              <h2 className="section__title">Popular in Category</h2>
            </Col>
            {
              loading? <h5 className='fw-bold'>Loading...</h5>:
               <ProductsList data={popularProducts} />
            }

          </Row>
        </Container>
      </section>

    </Helmet>
  )
}

export default Home