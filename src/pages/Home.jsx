import { useEffect, useState } from "react";
import { useJWT } from "../hooks/useJWT";
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/Card";

import axios from "axios";
import Cookies from "js-cookie";
import { Skeleton } from "../components/Skeleton";

export const Home = () => {
  const { credentials } = useJWT();

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://be-nutech.vercel.app/api/v1/products",
        {
          params: {
            page: currentPage,
          },
        }
      );
      const { data, pagination } = response.data;
      setProducts(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    navigate({ search: searchParams.toString() });
  };

  const handleLogout = () => {
    Cookies.remove("___session");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="h-[50px] bg-white gap-5 flex items-center justify-end border p-5">
        <div className="font-bold">{credentials ? credentials.name : null}</div>
        <div>
          {credentials ? (
            <>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/auth/login")}>Login</Button>
            </>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap -mx-2">
          {products.length !== 0 ? (
            products.map((product) => {
              return (
                <div
                  key={product._id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-2 mb-4"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="font-bold">
                        {product.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <img
                          src={product.img}
                          style={{
                            objectFit: "contain",
                            height: "200px",
                            width: "100%",
                          }}
                        />
                      </div>

                      <div>Description: {product.description}</div>

                      <div>Price: {product.price_sell}</div>
                      <div>Stock: {product.stock}</div>
                      <div>Category: {product.categoryId?.name}</div>

                      {/* EDIT PRODUCT */}
                    </CardContent>
                  </Card>
                </div>
              );
            })
          ) : (
            <>
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-2 mb-4"
                >
                  <Card className="h-full">
                    <CardHeader className="h-[65px]">
                      <CardTitle className="font-bold">
                        <Skeleton className="w-full h-[30px]" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Skeleton className="h-[250px] mb-3" />
                      </div>

                      <div>
                        <Skeleton className="h-[30px] mb-3" />
                      </div>

                      <div>
                        <Skeleton className="h-[30px]" />
                      </div>
                      <div>
                        <Skeleton />
                      </div>
                      <div>
                        <Skeleton />
                      </div>

                      {/* EDIT PRODUCT */}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="flex justify-center gap-5">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={currentPage === page}
              >
                {page}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
