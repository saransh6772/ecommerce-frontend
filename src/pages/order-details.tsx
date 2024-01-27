import { server } from "../redux/store";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { Order, OrderItem } from "../types/types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useOrdersDetailsQuery } from "../redux/api/orderAPI";
import { Skeleton } from "../components/loader";

const defaultInfo: Order = {
  shippingInfo: {
    address: "",
    city: "",
    country: "",
    pinCode: "",
    state: "",
  },
  status: "",
  subtotal: 0,
  shippingCharges: 0,
  tax: 0,
  discount: 0,
  total: 0,
  orderItems: [],
  user: {
    name: "",
    _id: "",
  },
  _id: "",
}

const OrderDetails = () => {
  const params = useParams()
  const { isLoading, isError, data, error } = useOrdersDetailsQuery(params.id!)
  const { shippingInfo: { address, state, city, country, pinCode }, user: { name }, orderItems, status, subtotal, total, tax, shippingCharges, discount } = data?.order || defaultInfo
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const navigate = useNavigate()
  const submitHandler = () => {
    navigate("/orders")
  }
  return (
    <div className="admin-container2">
      <button className="back-btn" onClick={submitHandler}>Back</button>
      <main className="product-management">
        {
          isLoading ? <Skeleton /> : <>
            <section
              style={{
                padding: "2rem",
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${server}/${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {subtotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                        ? "green"
                        : "red"
                  }
                >
                  {status}
                </span>
              </p>
            </article>
          </>
        }
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ${price} X {quantity} = ${price * quantity}
    </span>
  </div>
);

export default OrderDetails;