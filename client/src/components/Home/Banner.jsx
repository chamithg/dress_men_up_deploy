import React from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import "./Banner.css";
import banner from "../Assets/banner.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Context";

export default function Banner() {
  const {
    setPriceFilter,
    setTypeFilter,
    setSizeFilter,
    setFeaturedFilter,
    setSearch,
  } = useGlobalContext();

  const navigate = useNavigate();

  const viewProducts = () => {
    setSearch("");
    setTypeFilter("");
    setSizeFilter("");
    setPriceFilter("");
    setFeaturedFilter(false);
    navigate("/products");
  };
  return (
    <div className="banner-main">
      <div className="banner-left">
        <h2>welcome to</h2>
        <br />
        <div className="logo">
          <h1>Dress Men Up!</h1>
        </div>
        <br />
        <h2>Treat yourself with some fine Clothing..</h2>

        <button className="btn shop-all" onClick={() => viewProducts()}>
          <h3>
            Take a look
            <FaAngleDoubleRight />
          </h3>
        </button>
      </div>
      <div className="banner-right">
        <img className="banner-image" src={banner} alt="baner" />
      </div>
    </div>
  );
}
