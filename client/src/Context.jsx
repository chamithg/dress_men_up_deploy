import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

const AppContext = React.createContext();

const Wrapper = ({ children }) => {
  const [item, setItem] = useState({});
  const [items, setItems] = useState([]);
  const [formError, setFormError] = useState({});
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [currentUserCart, setCurrentUserCart] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);
  const [loginFormErrors, setLoginFormErrors] = useState("");
  const [regFormErrors, setRegFormErrors] = useState({});
  const [cartQuentity, setCartQuentity] = useState();

  // ! get fetch
  //!-----------------------------------------------Item-------------------------------

  const fetch = () => {
    axios
      .get("http://localhost:8000/api/items")
      .then((res) => {
        let tempRes = res.data.results;
        if (search !== "") {
          tempRes = tempRes.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (featuredFilter) {
          tempRes = tempRes.filter((item) => item.isFeatured);
        }
        if (typeFilter !== "") {
          tempRes = tempRes.filter((item) => item.type === typeFilter);
        }
        if (sizeFilter !== "") {
          tempRes = tempRes.filter((item) => item.size === sizeFilter);
        }
        if (priceFilter !== "") {
          if (priceFilter === "25>") {
            tempRes = tempRes.filter((item) => item.price <= 25);
          }
          if (priceFilter === "50>25") {
            tempRes = tempRes.filter(
              (item) => 25 < item.price && item.price <= 50
            );
          }
          if (priceFilter === "75>50") {
            tempRes = tempRes.filter(
              (item) => 50 < item.price && item.price <= 75
            );
          }
          if (priceFilter === ">75") {
            tempRes = tempRes.filter((item) => item.price > 75);
          }
        }

        setItems(tempRes);
      })
      .catch((err) => console.log("err getting all item ", err));
  };

  useEffect(() => {
    fetch();
  }, [
    triggerFetch,
    typeFilter,
    priceFilter,
    sizeFilter,
    search,
    featuredFilter,
  ]);
  // ! get only featured

  useEffect(() => {
    getLoggedUser();
  }, []);

  useEffect(() => {
    if (loggedUser) {
      getUserCart(loggedUser._id);
    }
  }, [loggedUser]);

  const getFeatured = () => {
    axios
      .get("http://localhost:8000/api/items")
      .then((res) => {
        let tempRes = res.data.results;
        tempRes = tempRes.filter((item) => item.isFeatured);
        setFeatured(tempRes);
      })
      .catch((err) => console.log("err getting featured ", err));
  };

  // ! getOne fetch

  const fetchOne = (id) => {
    axios
      .get(`http://localhost:8000/api/items/${id}`)
      .then((res) => {
        setItem(res.data.results);
      })
      .catch((err) => console.log("err getting one item ", err));
  };

  // ! create

  const fetchAdd = (input, navigate) => {
    axios
      .post("http://localhost:8000/api/items/new", input)
      .then((response) => {
        if (response.data.errors) {
          setFormError(response.data.errors);
          console.log("error add new item" + formError);
        } else {
          setTriggerFetch(!triggerFetch);
          setFormError({});
          navigate("/");
          setItem({});
        }
      })
      .catch((err) => console.log("error add new item", err));
  };

  // ! delete fetch

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/api/items/${id}/delete`)
      .then((res) => {
        setTriggerFetch(!triggerFetch);
      })
      .catch((err) => console.log("error deleting item", err));
  };
  //! Edit fetch

  const handleEdit = (id, input, navigate) => {
    axios
      .put(`http://localhost:8000/api/items/${id}/update`, input)
      .then((response) => {
        if (response.data.errors) {
          setFormError(response.data.errors);
          console.log("error editing item", formError);
        } else {
          setTriggerFetch(!triggerFetch);
          setFormError({});
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("error editing item", err);
      });
  };

  //!-----------------------------------------------User-------------------------------

  //! get logged user

  const getLoggedUser = () => {
    axios
      .get("http://localhost:8000/api/users/getloggedinuser", {
        withCredentials: true,
      })
      .then((res) => {
        //! this means user is logged in and can access the page
        if (res.data.results) {
          setLoggedUser(res.data.results);
        } else {
          setFormError(res.data.errors);
          console.log("error getting logged in user", formError);
          //! this means user is not logged in and cant access the page/ will be redirected
        }
      })
      .catch((err) => {
        console.log("error when getting logged in user", err);
      });
  };

  //! LOGIN

  const setLogin = (formInfo, navigate) => {
    axios
      .post("http://localhost:8000/api/users/login", formInfo, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.error) {
          setLoginFormErrors(res.data.error);
        } else {
          setCurrentUserCart([]);
          setLoggedUser(res.data.results);
          setLoginFormErrors("");
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("error when loggin in", err);
      });
  };

  //!REG

  const setReg = (formInfo, navigate) => {
    axios
      .post("http://localhost:8000/api/users/register", formInfo, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("res after reg", res);
        if (res.data.errors) {
          setRegFormErrors(res.data.errors);
        } else {
          setCurrentUserCart([]);
          setLoggedUser(res.data.results);
          setRegFormErrors({});
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("there was an error", err);
      });
  };

  //!-----------------------------------------------Cart-------------------------------

  //!add to cart

  const addToCart = (cartItem, navigate) => {
    axios
      .post("http://localhost:8000/api/cart/items/add", cartItem)
      .then((response) => {
        if (response.data.errors) {
          setFormError(response.data.errors);
          console.log("error adding item to cart", formError);
        } else {
          navigate("/products");
        }
      })
      .catch((err) => console.log("error adding item to cart", err));
  };

  //!get items in the current user cart

  const getUserCart = (user) => {
    axios
      .get(`http://localhost:8000/api/cart/items/${user}`)
      .then((response) => {
        if (response) {
          setCurrentUserCart(response.data.results.cartItems);
          let cartTotal = 0;
          for (let i in response.data.results.cartItems) {
            cartTotal += response.data.results.cartItems[i].quantity;
          }
          setCartQuentity(cartTotal);
        } else {
          setCurrentUserCart([]);
          setCartQuentity();
          setFormError(response.data.errors);
          console.log("error fetching current cart", formError);
        }
      })
      .catch((err) => console.log("error fetching current cart", err));
  };

  //! reomove one cart item

  const removeOneCartItem = (itemToRemove) => {
    axios
      .put(
        `http://localhost:8000/api/cart/items/removeOneCartItem`,
        itemToRemove
      )
      .then((response) => {
        if (response.data.errors) {
          setFormError(response.data.errors);
          console.log("error remove item from cart", formError);
        }
        getUserCart(itemToRemove.user);
      })
      .catch((err) => console.log("error remove item from cart", err));
  };

  // ! increse / decrease item quantity by one

  const changeByOne = (itemToInc) => {
    axios
      .put(`http://localhost:8000/api/cart/items/changeCountByOne`, itemToInc)
      .then((response) => {
        if (response.data.errors) {
          setFormError(response.data.errors);
          console.log("error change cart item quantity", formError);
        }
        getUserCart(itemToInc.userId);
      })
      .catch((err) => console.log("error change cart item quantity", err));
  };

  //!-----------------------------------------------Reviews-------------------------------

  //!add to Reviews

  const addToReviews = (newRating) => {
    console.log("newRate");
    axios
      .post("http://localhost:8000/api/ratings/new", newRating)
      .then((response) => {
        if (response.data.errors) {
          setFormError(response.data.errors);
          setFormError(response.data.errors);
          console.log("error adding review", formError);
        }
      })
      .catch((err) => console.log("error adding review", err));
  };

  //!get  Reviews

  return (
    <AppContext.Provider
      value={{
        item,
        items,
        formError,
        loggedUser,
        currentUserCart,
        typeFilter,
        sizeFilter,
        priceFilter,
        search,
        featured,
        featuredFilter,
        loginFormErrors,
        regFormErrors,
        cartQuentity,
        handleDelete,
        handleEdit,
        fetch,
        fetchOne,
        fetchAdd,
        getLoggedUser,
        setLoggedUser,
        addToCart,
        getUserCart,
        removeOneCartItem,
        changeByOne,
        addToReviews,
        setPriceFilter,
        setTypeFilter,
        setSizeFilter,
        setSearch,
        getFeatured,
        setFeaturedFilter,
        setLogin,
        setReg,
        setCartQuentity,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, Wrapper };
