import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Login from '../pages/Login'
import ProductDetails from '../pages/ProductDetails'
import Shop from '../pages/Shop'
import Signup from '../pages/Signup'
import ProtectedRoute from './ProtectedRoute'
import AddProducts from '../admin/AddProducts'
import AllProducts from '../admin/AllProducts'
import Dashboard from '../admin/Dashboard'
import Users from '../admin/Users'
import MyOrders from '../pages/MyOrders'
import MyWarranty from '../pages/MyWarranty'
import ApproveOrders from '../admin/ApproveOrders'
import Orders from '../admin/Orders'

const Routers = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='home' element={<Home />} />
            <Route path='shop' element={<Shop />} />
            <Route path='shop/:id' element={<ProductDetails />} />
            <Route path='signup' element={<Signup />} />
            <Route path='login' element={<Login />} />
            <Route path='cart' element={<Cart />} />



            <Route path='/*' element={<ProtectedRoute />}>

                <Route path="checkout" element={<Checkout />} />
                <Route path="myorders" element={<MyOrders />}></Route>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="dashboard/all-products" element={<AllProducts />} />
                <Route path="dashboard/add-products" element={<AddProducts />} />
                <Route path="dashboard/users" element={<Users />} />
                <Route path="dashboard/approve-orders" element={<ApproveOrders />} />
                <Route path="dashboard/orders" element={<Orders />} />
                <Route path="dashboard/all-products" element={<AllProducts />} />;
                <Route path="mywarranty" element={<MyWarranty />} />

            </Route>

            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />

        </Routes>
    )
}

export default Routers