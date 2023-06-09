import axios from "axios";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  const getDatas = async () => {
    try {
      axios
        .get("https://be-nutech.vercel.app/api/v1/products")
        .then(({ data }) => {
          //       console.log(data.data);
          setProducts(data.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      axios
        .get("https://be-nutech.vercel.app/api/v1/category")
        .then(({ data }) => {
          //    console.log(data.data);
          setCategory(data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  return (
    <div>
      <h3 className="mb-3 font-bold">Dashboard</h3>
      <div className="flex gap-3">
        <div className="h-[70px] w-[200px] p-3 bg-slate-900 flex items-center gap-2 flex-row ">
          <h1 className="text-xl text-white font-bold ">Products </h1>
          <div className="text-white">({products?.length})</div>
        </div>

        <div className="h-[70px] w-[200px] p-3 bg-slate-900 flex items-center gap-2 flex-row ">
          <h1 className="text-xl text-white font-bold ">Category </h1>
          <div className="text-white">({category?.length})</div>
        </div>
      </div>
    </div>
  );
};
