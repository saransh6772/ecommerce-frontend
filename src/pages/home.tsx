import { Link } from 'react-router-dom'
import ProductCard from '../components/product-card'
import { useLatestProductsQuery } from '../redux/api/productAPI'
import toast from 'react-hot-toast'
import { Skeleton } from '../components/loader'
import { CartItem } from '../types/types'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/reducer/cartReducer'

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("")
  const dispatch = useDispatch()
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("out of stock");
    dispatch(addToCart(cartItem));
    toast.success("added to cart")
  }
  if (isError) toast.error("can't fetch products")
  return (
    <div className="home">
      <h1>
        Latest Products
        <Link to="/search" className="findmore">More</Link>
      </h1>
      <main>
        {isLoading ? (<Skeleton width='80vw' />) :
          (data?.products.map((i) => (
            <ProductCard key={i._id} productId={i._id} name={i.name} photo={i.photo} price={i.price} stock={i.stock} handler={addToCartHandler} />
          )))
        }
      </main>
    </div>
  )
}

export default Home