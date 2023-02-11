import React, { useEffect, useState } from "react";
import {
  CDBBtn,
  CDBProgress,
  CDBTable,
  CDBTableHeader,
  CDBTableBody,
  CDBContainer,
  CDBLink,
} from "cdbreact";
import { Pie, Bar } from "react-chartjs-2";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import "./Dashboard.css";

export const Dashboard = () => {
  let user_item = [];
  const [totalPrice, setTotalPrice] = useState(0);
  const [dataPie, setDataPie] = useState([]);
  const [pieLabel, setPieLabel] = useState([]);

  const fetchData = async () => {
    let items = [];
    let result = await fetch(
      "https://p01-product-api-production.up.railway.app/api/products"
    );
    result = await result.json();
    items = [...items, result.data];

    let user_cart = [];
    result = await fetch(
      "https://sp11-cart.000webhostapp.com/api/carts/read.php"
    );
    result = await result.json();
    user_cart = [...user_cart, result.data];

    let cart_item = [];
    for (const cart of user_cart[0]) {
      let result = await fetch(
        `https://sp11-cart.000webhostapp.com/api/carts_details/show.php?cart_id=${cart.cart_id}`
      );
      result = await result.json();
      cart_item = [...cart_item, result.data];
    }

    result = await fetch(
      "https://p01-product-api-production.up.railway.app/api/categories"
    );
    result = await result.json();
    let categories = result.data;
    let category_quantity = [];
    categories.forEach((category) => {
      let quantity = 0;
      cart_item.forEach((cart) => {
        if (cart.length > 0) {
          cart.forEach((product) => {
            for (let i = 0; i < items[0].length; i++) {
              if (
                Number(product.product_id) === items[0][i].id &&
                items[0][i].category_id === category.id
              ) {
                quantity += Number(product.quantity);
              }
            }
          });
        }
      });
      category_quantity = [
        ...category_quantity,
        { category_id: category.id, quantity: quantity },
      ];
    });
    let data = [];
    category_quantity.forEach((element) => {
      data = [...data, element.quantity];
    });
    setDataPie(data);
    data = [];
    categories.forEach((element) => {
      data = [...data, element.name];
    });
    setPieLabel(data);

    let total = 0;
    cart_item.forEach((cart) => {
      if (cart.length > 0) {
        cart.forEach((product) => {
          for (let i = 0; i < items[0].length; i++) {
            if (Number(product.product_id) === items[0][i].id) {
              total +=
                items[0][i].sale_price *
                (1 - items[0][i].sale_off / 100) *
                product.quantity;
            }
          }
        });
      }
    });
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const data = {
    chart1: {
      labels: pieLabel,
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: [
            "#F2C94C",
            "#2F80ED",
            "#9B51E0",
            "#194f28",
            "#cd9c8c",
            "#cd9d7e",
            "#46e039",
            "#e8d8ea",
            "#acc7b3",
            "#33e57f",
            "#7af188",
            "#433173",
            "#644ce3",
            "#96d923",
            "#dcfebe",
          ],
          borderWidth: 0,
          data: dataPie,
        },
      ],
    },
    chart2: {
      labels: [
        "Eating",
        "Drinking",
        "Sleeping",
        "Designing",
        "Coding",
        "Cycling",
        "Running",
      ],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgba(255, 153, 51, 0.8)",
          borderColor: "rgb(102, 51, 0)",
          data: [65, 59, 75, 81, 56, 55, 40],
        },
        {
          label: "My Second dataset",
          backgroundColor: "#2F80ED",
          borderColor: "rgb(0, 41, 102)",
          data: [38, 48, 60, 79, 96, 47, 80],
        },
      ],
    },
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
    },
  };

  return (
    <div className="dashboard d-flex">
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
          <div style={{ height: "calc(100% - 64px)", overflowY: "scroll" }}>
            <div className="d-flex card-section">
              <div className="cards-container">
                <div className="card-bg w-100 border d-flex flex-column">
                  <div className="p-4 d-flex flex-column h-100">
                    <div className="d-flex align-items-center justify-content-between">
                      <h4 className="m-0 h5 font-weight-bold text-dark">
                        Sales
                      </h4>
                      <div className="py-1 px-2 bg-grey rounded-circle">
                        <i className="fas fa-suitcase"></i>
                      </div>
                    </div>
                    <h4 className="my-4 text-right text-dark h2 font-weight-bold">
                      {totalPrice} Dong
                    </h4>
                    <CDBProgress
                      value={30}
                      height={8}
                      colors="primary"
                    ></CDBProgress>
                    <p className="mt-2 text-success small">
                      <span
                        style={{ fontSize: "0.95em" }}
                        className="ml-2 font-weight-bold text-muted"
                      >
                        30% until target
                      </span>
                    </p>
                    <p className="c-p mb-0 text-dark font-weight-bold text-right mt-auto">
                      More Details
                      <i className="fas fa-arrow-right ml-1"></i>
                    </p>
                  </div>
                </div>
                <div className="card-bg w-100 border d-flex flex-column">
                  <div className="p-4 d-flex flex-column h-100">
                    <div className="d-flex align-items-center justify-content-between">
                      <h4 className="m-0 h5 font-weight-bold text-dark">
                        Tỷ lệ số lượng hàng trong giỏ
                      </h4>
                      <div className="px-2 py-1 bg-grey rounded-circle">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-between">
                      <CDBContainer
                        style={{
                          width: "250px",
                          height: "150px",
                          margin: "0 -4rem",
                        }}
                        className="p-0"
                      >
                        <Pie
                          data={data.chart1}
                          options={
                            ({ responsive: true },
                            { maintainAspectRatio: false },
                            { legend: { display: false } })
                          }
                        />
                      </CDBContainer>
                      <div className="text-right w-25">
                        <div>
                          <div
                            className="d-flex align-items-center justify-content-between"
                            style={{ color: "#cd9c8c" }}
                          >
                            <span
                              style={{
                                fontSize: "3em",
                                margin: "-2rem 0px -1.5rem 0px",
                              }}
                            >
                              &#8226;
                            </span>
                            <span className="small">Jeans</span>
                          </div>
                          <div
                            className="d-flex align-items-center justify-content-between"
                            style={{ color: "#F2C94C" }}
                          >
                            <span
                              style={{
                                fontSize: "3em",
                                margin: "-2rem 0px -1.5rem 0px",
                              }}
                            >
                              &#8226;
                            </span>
                            <span className="small">Polo</span>
                          </div>
                          <div
                            className="d-flex align-items-center justify-content-between"
                            style={{ color: "#9B51E0" }}
                          >
                            <span
                              style={{
                                fontSize: "3em",
                                margin: "-2rem 0px -1.5rem 0px",
                              }}
                            >
                              &#8226;
                            </span>
                            <span className="small">Hoodies</span>
                          </div>
                          <div
                            className="d-flex align-items-center justify-content-between"
                            style={{ color: "#194f28" }}
                          >
                            <span
                              style={{
                                fontSize: "3em",
                                margin: "-2rem 0px -1.5rem 0px",
                              }}
                            >
                              &#8226;
                            </span>
                            <span className="small">T-Shirt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="c-p text-dark mb-0 font-weight-bold text-right mt-auto">
                      More Details
                      <i className="fas fa-arrow-right ml-1"></i>
                    </p>
                  </div>
                </div>
                {/* <div
                  className="card-bg w-100 border d-flex flex-column p-4"
                  style={{ gridRow: "span 2" }}
                >
                  <div className="d-flex">
                    <h6 className="h5 font-weight-bold text-dark">
                      Team Members
                    </h6>
                    <div className="ml-auto rounded-circle bg-grey py-1 px-2">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane1.png"
                      className="pane-image"
                      size="md"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0" style={{ fontSize: "0.75em" }}>
                        Online
                      </p>
                    </div>
                    <CDBBtn
                      style={{ background: "#333" }}
                      flat
                      size="small"
                      className="border-0 ml-auto px-2 my-2"
                    >
                      <span className="msg-rem">Send</span> Message
                    </CDBBtn>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane2.png"
                      className="pane-image"
                      size="md"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0" style={{ fontSize: "0.75em" }}>
                        Online
                      </p>
                    </div>
                    <CDBBtn
                      style={{ background: "#333" }}
                      flat
                      size="small"
                      className="border-0 ml-auto px-2 my-2"
                    >
                      <span className="msg-rem">Send</span> Message
                    </CDBBtn>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane3.png"
                      className="pane-image"
                      size="md"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0" style={{ fontSize: "0.75em" }}>
                        Online
                      </p>
                    </div>
                    <CDBBtn
                      style={{ background: "#333" }}
                      flat
                      size="small"
                      className="border-0 ml-auto px-2 my-2"
                    >
                      <span className="msg-rem">Send</span> Message
                    </CDBBtn>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane4.png"
                      className="pane-image"
                      size="md"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0" style={{ fontSize: "0.75em" }}>
                        Online
                      </p>
                    </div>
                    <CDBBtn
                      style={{ background: "#333" }}
                      flat
                      size="small"
                      className="border-0 ml-auto px-2 my-2"
                    >
                      <span className="msg-rem">Send</span> Message
                    </CDBBtn>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane5.png"
                      className="pane-image"
                      size="md"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0" style={{ fontSize: "0.75em" }}>
                        Online
                      </p>
                    </div>
                    <CDBBtn
                      style={{ background: "#333" }}
                      flat
                      size="small"
                      className="border-0 ml-auto px-2 my-2"
                    >
                      <span className="msg-rem">Send</span> Message
                    </CDBBtn>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane1.png"
                      className="pane-image"
                      size="md"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0" style={{ fontSize: "0.75em" }}>
                        Online
                      </p>
                    </div>
                    <CDBBtn
                      style={{ background: "#333" }}
                      flat
                      size="small"
                      className="border-0 ml-auto px-2 my-2"
                    >
                      <span className="msg-rem">Send</span> Message
                    </CDBBtn>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane2.png"
                      className="pane-image"
                      size="md"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0" style={{ fontSize: "0.75em" }}>
                        Online
                      </p>
                    </div>
                    <CDBBtn
                      style={{ background: "#333" }}
                      flat
                      size="small"
                      className="border-0 ml-auto px-2 my-2"
                    >
                      <span className="msg-rem">Send</span> Message
                    </CDBBtn>
                  </div>
                  <p className="c-p text-dark mb-0 font-weight-bold text-right mt-auto">
                    More Details
                    <i className="fas fa-arrow-right ml-1"></i>
                  </p>
                </div> */}
                {/* <div
                  className="card-bg w-100 d-flex flex-column border d-flex flex-column"
                  style={{ gridRow: "span 2" }}
                >
                  <div className="p-4 d-flex flex-column h-100">
                    <div className="d-flex align-items-center justify-content-between">
                      <h4 className="m-0 h5 font-weight-bold text-dark">
                        Total Orders
                      </h4>
                      <div className="px-2 py-1 bg-grey rounded-circle">
                        <i className="fas fa-shopping-bag"></i>
                      </div>
                    </div>
                    <div className="mt-5 d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="m-0 h1 font-weight-bold text-dark">
                          452
                        </h4>
                        <p className="text-success small">
                          <i className="fas fa-angle-up p-0"></i> 18.52%
                        </p>
                      </div>
                      <div className="text-right d-flex flex-column justify-content-between">
                        <div className="d-flex align-items-center justify-content-between text-primary">
                          <span
                            style={{
                              fontSize: "3em",
                              margin: "-2rem 0px -1.5rem 0px",
                            }}
                          >
                            &#8226;
                          </span>
                          <span className="small">August</span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between text-warning">
                          <span
                            style={{
                              fontSize: "3em",
                              margin: "-2rem 0px -1.5rem 0px",
                            }}
                          >
                            &#8226;
                          </span>
                          <span className="small ml-2">September</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-0 mt-auto">
                      <Bar height={250} data={data.chart2} options={options} />
                    </div>
                    <p className="c-p text-dark font-weight-bold text-right mt-3 mb-0">
                      More Details
                      <i className="fas fa-arrow-right ml-1"></i>
                    </p>
                  </div>
                </div> */}
                {/* <div className="card-bg w-100 border d-flex flex-column p-4">
                  <div className="d-flex">
                    <h6 className="h5 font-weight-bold text-dark">Messages</h6>
                    <div className="ml-auto rounded-circle bg-grey px-2 py-1">
                      <i className="fas fa-comment-alt"></i>
                    </div>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane3.png"
                      className="pane-image"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0 small">Hey, how are you.</p>
                    </div>
                    <p
                      style={{ fontSize: "0.5em" }}
                      className="px-2 d-flex align-items-center text-muted"
                    >
                      <i
                        className="fas fa-circle mr-1"
                        style={{ fontSize: "0.8em" }}
                      ></i>
                      <span style={{ fontSize: "1.4em" }}>Online</span>
                    </p>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane4.png"
                      className="pane-image"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0 small">Hey, how are you.</p>
                    </div>
                    <p
                      style={{ fontSize: "0.5em" }}
                      className="px-2 d-flex align-items-center text-muted"
                    >
                      <i
                        className="fas fa-circle mr-1"
                        style={{ fontSize: "0.8em" }}
                      ></i>
                      <span style={{ fontSize: "1.4em" }}>Online</span>
                    </p>
                  </div>
                  <div className="d-flex mt-4">
                    <img
                      alt="panelImage"
                      src="img/pane/pane5.png"
                      className="pane-image"
                    />
                    <div>
                      <h6 className="mb-0" style={{ fontWeight: "600" }}>
                        Mezue
                      </h6>
                      <p className="m-0 small">Hey, how are you.</p>
                    </div>
                    <p
                      style={{ fontSize: "0.5em" }}
                      className="px-2 d-flex align-items-center text-muted"
                    >
                      <i
                        className="fas fa-circle mr-1"
                        style={{ fontSize: "0.8em" }}
                      ></i>
                      <span style={{ fontSize: "1.4em" }}>Online</span>
                    </p>
                  </div>
                  <p className="c-p text-dark font-weight-bold text-right mt-auto mb-0">
                    More Details
                    <i className="fas fa-arrow-right ml-1"></i>
                  </p>
                </div> */}
                {/* <div className="card-bg w-100 d-flex flex-column wide border d-flex flex-column">
                  <div className="d-flex flex-column p-0 h-100">
                    <div className="mx-4 mt-3 d-flex justify-content-between align-items-center">
                      <h4 className="font-weight-bold text-dark h5">
                        Page Visits
                      </h4>
                      <div className="p-1 bg-grey rounded-circle">
                        <i className="fas fa-sticky-note"></i>
                      </div>
                    </div>
                    <CDBTable borderless responsive>
                      <CDBTableHeader color="light">
                        <tr>
                          <th>Page Name</th>
                          <th className="table-rem">Views</th>
                          <th className="table-rem">Value</th>
                          <th>Bounce Rate</th>
                        </tr>
                      </CDBTableHeader>
                      <CDBTableBody>
                        <tr>
                          <td>/demo/admin/index.html</td>
                          <td className="table-rem">3,689</td>
                          <td className="table-rem">$10</td>
                          <td className="text-success text-center">
                            <i className="fas fa-arrow-up"></i> 20%
                          </td>
                        </tr>
                        <tr>
                          <td>/demo/admin/index.html</td>
                          <td className="table-rem">3,689</td>
                          <td className="table-rem">$10</td>
                          <td className="text-success text-center">
                            <i className="fas fa-arrow-up"></i> 20%
                          </td>
                        </tr>
                        <tr>
                          <td>/demo/admin/index.html</td>
                          <td className="table-rem">3,689</td>
                          <td className="table-rem">$10</td>
                          <td className="text-success text-center">
                            <i className="fas fa-arrow-up"></i> 20%
                          </td>
                        </tr>
                      </CDBTableBody>
                    </CDBTable>
                    <p className="c-p text-dark font-weight-bold text-right mt-auto mr-3">
                      See More
                      <i className="fas fa-arrow-right ml-1"></i>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
            {/* <footer className="footer">
              <div className="d-flex align-items-center">
                <CDBLink to="/" className="text-dark footer-link">
                  <img alt="logo" src="/img/pages/logo.png" width="25px" />
                  <span className="ml-4 lead mb-0 font-weight-bold">
                    Devwares
                  </span>
                </CDBLink>
                <span
                  className="footer-rem"
                  style={{
                    fontSize: "3em",
                    margin: "-2rem 0px -1.5rem 1rem",
                    color: "#C4C4C4",
                  }}
                >
                  &#8226;
                </span>
                <small className="ml-2 mt-1">
                  &copy; Devwares, 2020. All rights reserved.
                </small>
              </div>
              <div className="footer-rem">
                <CDBBtn
                  flat
                  color="dark"
                  className="py-1 px-2 bg-dark border-0"
                >
                  <i className="fab fa-facebook-f"></i>
                </CDBBtn>
                <CDBBtn
                  flat
                  color="dark"
                  className="mx-3 py-1 px-2 bg-dark border-0"
                >
                  <i className="fab fa-twitter"></i>
                </CDBBtn>
                <CDBBtn
                  flat
                  color="dark"
                  className="py-1 px-2 bg-dark border-0"
                >
                  <i className="fab fa-instagram"></i>
                </CDBBtn>
              </div>
            </footer> */}
          </div>
        </div>
      </div>
    </div>
  );
};
