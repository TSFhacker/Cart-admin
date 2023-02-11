import React, { useEffect, useState } from "react";
import { CDBTable, CDBTableHeader, CDBTableBody } from "cdbreact";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { CDBInput } from "cdbreact";

export const Tables = () => {
  const [cartList, setCartList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [availableUser, setAvailableUser] = useState([]);
  let user_item = [];

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);

    if (e.target.value.length > 0) {
      setAvailableUser(
        cartList.filter((cart) => {
          return cart.username.match(e.target.value);
        })
      );
    } else setAvailableUser(cartList);
  };

  const fetchCart = async () => {
    let user_cart = [];
    let result = await fetch(
      "https://sp11-cart.000webhostapp.com/api/carts/read.php"
    );
    result = await result.json();
    user_cart = [...user_cart, result.data];

    result = await fetch(
      `https://sp11-cart.000webhostapp.com/api/carts_details/count-products-by-uid.php`
    );
    result = await result.json();
    let cart_item = [];
    cart_item = [...cart_item, result.data];

    let count = 0;
    result = await fetch("https://api-admin-dype.onrender.com/api/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@ltct.com",
        password: "123456",
      }),
    });

    result = await result.json();
    let token = result.access_token;
    result = await fetch("https://api-admin-dype.onrender.com/api/user", {
      method: "get",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
    });

    result = await result.json();
    let user_list = [];
    user_list = result;

    user_cart[0].forEach((cart) => {
      for (let i = 0; i < cart_item[0].length; i++) {
        if (cart.cart_id === cart_item[0][i].cart_id) {
          user_item = [
            ...user_item,
            {
              user_id: cart.user_id,
              cart_id: cart.cart_id,
              total_products: cart_item[0][i].total_products,
            },
          ];
          count++;
          break;
        }
      }
      if (count === 0)
        user_item = [
          ...user_item,
          { user_id: cart.user_id, cart_id: cart.cart_id, total_products: 0 },
        ];
      count = 0;
    });

    user_item.forEach((element, index) => {
      for (let i = 0; i < user_list.length; i++) {
        if (element.user_id === JSON.stringify(user_list[i].id)) {
          user_item[index] = {
            user_id: element.user_id,
            cart_id: element.cart_id,
            total_products: element.total_products,
            username: user_list[i].name,
            email: user_list[i].email,
          };
          count++;
          break;
        }
      }
      if (count === 0)
        user_item[index] = {
          user_id: element.user_id,
          cart_id: element.cart_id,
          total_products: element.total_products,
          username: "default",
          email: "default",
        };
      count = 0;
    });
    setCartList(user_item);
    setAvailableUser(user_item);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="d-flex">
      <div>
        <Sidebar />
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexFlow: "column",
          height: "100vh",
          overflowY: "hidden",
        }}
      >
        <Navbar />
        <div style={{ height: "100%" }}>
          <div
            style={{
              padding: "20px 5%",
              height: "calc(100% - 64px)",
              overflowY: "scroll",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(1, minmax(200px, 700px))",
              }}
            >
              <div className="mt-5">
                <h4 className="font-weight-bold mb-3">Giỏ hàng</h4>
                <CDBInput
                  type="search"
                  size="md"
                  hint="Tìm kiếm"
                  className="mb-n4 mt-n3 input-nav"
                  onChange={handleChange}
                  value={searchInput}
                />
                <CDBTable responsive>
                  <CDBTableHeader color="dark">
                    <tr>
                      <th>ID</th>
                      <th>Tên khách hàng</th>
                      <th>Email</th>
                      <th>Số sản phẩm trong giỏ hàng</th>
                    </tr>
                  </CDBTableHeader>
                  <CDBTableBody>
                    {cartList.length > 0 ? (
                      availableUser.map((cart) => (
                        <tr className="user-info">
                          <td>{cart.user_id}</td>
                          <td>{cart.username}</td>
                          <td>{cart.email}</td>
                          <td>{cart.total_products}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>Loading...</td>
                        <td>Loading...</td>
                        <td>Loading...</td>
                        <td>Loading...</td>
                      </tr>
                    )}
                  </CDBTableBody>
                </CDBTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
