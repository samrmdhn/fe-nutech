import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/Card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/Alert_Dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/Select";

import { Label } from "../../components/Label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/Dialog";

import Button from "../../components/Button";
import Input from "../../components/TextField";
import { useJWT } from "../../hooks/useJWT";
import { Textarea } from "../../components/TextArea";
import { Alert, AlertTitle, AlertDescription } from "../../components/Alert";

export const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    pricesell: "",
    pricebuy: "",
    stock: "",
    categoryId: "",
  });
  const [img, setImg] = useState(null);
  const [productEditImg, setProductEditImg] = useState(null);
  const [productEdit, setProductEdit] = useState({});
  const [deleteDialog, setDeleteDialog] = useState("");
  const { credentials } = useJWT();

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getDatas();
  }, [currentPage]);

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    navigate({ search: searchParams.toString() });
  };

  const getDatas = async () => {
    try {
      axios
        .get("https://be-nutech.vercel.app/api/v1/products", {
          params: {
            page: currentPage,
          },
        })
        .then(({ data }) => {
          //    console.log(data.data);
          setProducts(data.data);
          setTotalPages(data.pagination.totalPages);
        })
        .catch(function (error) {
          console.log(error);
        });

      axios
        .get("https://be-nutech.vercel.app/api/v1/category")
        .then(({ data }) => {
          console.log(data.data);
          setCategory(data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    const selectedItem = products.find((product) => {
      return product._id === id;
    });

    setSelectedProduct((prev) => selectedItem);
  };

  const handleDeleteDialog = (e) => {
    setDeleteDialog((prev) => e.target.value.toLowerCase());
  };

  const handleDeleteItem = () => {
    try {
      axios
        .delete(
          `https://be-nutech.vercel.app/api/v1/products/${selectedProduct._id}`,
          {
            headers: {
              Authorization: `Bearer ${credentials.jwt}`,
            },
          }
        )
        .then((response) => {
          axios
            .get("https://be-nutech.vercel.app/api/v1/products", {
              params: {
                page: currentPage,
              },
            })
            .then(({ data }) => {
              //    console.log(data.data);
              setProducts(data.data);
              setTotalPages(data.pagination.totalPages);
            })
            .catch(function (error) {
              console.log(error);
            });

          setDeleteDialog((prev) => "");
        })
        .catch(({ data }) => {
          console.log(data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("price_sell", Number(productForm.pricesell));
    formData.append("price_buy", Number(productForm.pricebuy));
    formData.append("stock", productForm.stock);
    formData.append("description", productForm.description);
    formData.append("categoryId", productForm.categoryId);
    formData.append("image", img);
    setIsError((prev) => false);
    axios
      .post("https://be-nutech.vercel.app/api/v1/products", formData, {
        headers: {
          Authorization: `Bearer ${credentials.jwt}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        //    console.log(data);

        axios
          .get("https://be-nutech.vercel.app/api/v1/products", {
            params: {
              page: currentPage,
            },
          })
          .then(({ data }) => {
            //      console.log(data.data);
            setProducts(data.data);
            setTotalPages(data.pagination.totalPages);
          })
          .catch(function (error) {
            console.log(error);
          });

        setProductForm((prev) => ({
          name: "",
          description: "",
          pricesell: "",
          pricebuy: "",
          stock: "",
          categoryId: "",
        }));

        //   setImg((prev) => null);
        setIsSuccess((prev) => true);
        setIsError((prev) => false);
      })
      .catch(({ response }) => {
        console.log(response);
        setIsError((prev) => true);
      });
  };

  const handleEditProduct = (id) => {
    const edittedProduct = products.find((product) => {
      return product._id === id;
    });

    setProductEdit((prev) => ({
      ...edittedProduct,
      categoryId: edittedProduct.categoryId._id,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    //    console.log(productEdit);

    const formData = new FormData();
    formData.append("name", productEdit.name);
    formData.append("price_sell", Number(productEdit.price_sell));
    formData.append("price_buy", Number(productEdit.price_buy));
    formData.append("stock", productEdit.stock);
    formData.append("description", productEdit.description);
    formData.append("categoryId", productEdit.categoryId);
    formData.append("image", productEditImg);

    setIsError((prev) => false);
    axios
      .put(
        `https://be-nutech.vercel.app/api/v1/products/${productEdit._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${credentials.jwt}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(({ data }) => {
        //        console.log(data);

        axios
          .get("https://be-nutech.vercel.app/api/v1/products", {
            params: {
              page: currentPage,
            },
          })
          .then(({ data }) => {
            //        console.log(data.data);
            setProducts(data.data);
            setTotalPages(data.pagination.totalPages);
          })
          .catch(function (error) {
            console.log(error);
          });

        //  setProductEditImg((prev) => null);
        setIsSuccess((prev) => true);
        setIsError((prev) => false);
      })
      .catch(({ response }) => {
        console.log(response);
        setIsError((prev) => true);
      });
  };

  useEffect(() => {
    getDatas();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsError((prev) => false);
    }, 3000);
  }, [isError]);

  useEffect(() => {
    setTimeout(() => {
      setIsSuccess((prev) => false);
    }, 3000);
  }, [isSuccess]);

  return (
    <div>
      <h3 className="font-bold mb-3">Products</h3>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="mb-3">
            Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-bold">Add Product</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div>
            {isError && (
              <>
                <Alert className="bg-red-500 mb-3 text-white">
                  <AlertTitle className="font-bold">Unable to save</AlertTitle>
                  <AlertDescription>
                    Product name is already exists / Image
                    {" >"}
                    100kb
                  </AlertDescription>
                </Alert>
              </>
            )}

            {isSuccess && (
              <>
                <Alert className="mb-3 bg-green-500 text-white">
                  <AlertTitle className="font-bold">Success</AlertTitle>
                  <AlertDescription>
                    Product has been added/edited to database
                  </AlertDescription>
                </Alert>
              </>
            )}

            <form onSubmit={handleSubmit}>
              <Label htmlFor="name" className="mb-3">
                Name
                <Input
                  required
                  value={productForm.name}
                  id="name"
                  className="mt-1 mb-3"
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </Label>
              <Label>
                Category
                <Select
                  required
                  value={productForm?.categoryId?._id}
                  onValueChange={(value) =>
                    setProductForm((prev) => ({
                      ...prev,
                      categoryId: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full mt-1 mb-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>-- Choose Category --</SelectLabel>
                      {category.map((c) => {
                        return (
                          <>
                            <SelectItem key={c._id} value={c._id}>
                              {c.name}
                            </SelectItem>
                          </>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>

              <Label htmlFor="price_buy" className="text-right">
                Price Buy
                <Input
                  required
                  value={productForm.pricebuy}
                  id="price_buy"
                  className="mt-1 mb-3"
                  type="number"
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      pricebuy: Number(e.target.value),
                    }))
                  }
                />
              </Label>

              <Label htmlFor="price_sell" className="text-right">
                Price Sell
                <Input
                  required
                  value={productForm.pricesell}
                  id="price_sell"
                  className="mt-1 mb-3"
                  type="number"
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      pricesell: Number(e.target.value),
                    }))
                  }
                />
              </Label>

              <Label htmlFor="stock" className="text-right">
                Stock
                <Input
                  required
                  id="stock"
                  value={productForm.stock}
                  className="mt-1 mb-3"
                  type="number"
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                />
              </Label>

              <Label htmlFor="description" className="text-right">
                Description
                <Textarea
                  required
                  value={productForm.description}
                  id="description"
                  className="mt-1 mb-3"
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Label>

              <Label>
                Imaage
                <br />
                <input
                  required
                  type="file"
                  accept="image/*"
                  className="mb-6"
                  onChange={(e) => setImg((prev) => e.target.files[0])}
                />
              </Label>
              <div className="flex justify-end">
                <Button className="w-full" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-row flex-wrap -mx-2">
        {products.map((product) => {
          return (
            <div
              key={product._id}
              className="w-1/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-2 mb-4"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="font-bold">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <img
                      src={product.img}
                      style={{
                        objectFit: "contain",
                        height: "100px",
                        width: "100%",
                      }}
                    />
                  </div>

                  <div>{product.description}</div>

                  <div>Buy price: {product.price_buy}</div>
                  <div>Sell price: {product.price_sell}</div>
                  <div>Stock: {product.stock}</div>
                  <div>Category: {product.categoryId?.name}</div>

                  {/* EDIT PRODUCT */}
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center gap-2 w-full">
                    <div>Action</div>
                    <div className="flex justify-end gap-2">
                      <div>
                        {" "}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              onClick={() => handleEditProduct(product._id)}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="font-bold">
                                Edit Product
                              </DialogTitle>
                              <DialogDescription></DialogDescription>
                            </DialogHeader>

                            <div>
                              {isError && (
                                <>
                                  <Alert className="bg-red-500 mb-3 text-white">
                                    <AlertTitle className="font-bold">
                                      Unable to save
                                    </AlertTitle>
                                    <AlertDescription>
                                      Product name is already exists / Image
                                      {" >"}
                                      100kb
                                    </AlertDescription>
                                  </Alert>
                                </>
                              )}

                              {isSuccess && (
                                <>
                                  <Alert className="mb-3 bg-green-500 text-white">
                                    <AlertTitle className="font-bold">
                                      Success
                                    </AlertTitle>
                                    <AlertDescription>
                                      Product has been added/edited to database
                                    </AlertDescription>
                                  </Alert>
                                </>
                              )}

                              <form onSubmit={handleEditSubmit}>
                                <Label htmlFor="name" className="mb-3">
                                  Name
                                  <Input
                                    required
                                    value={productEdit.name}
                                    id="name"
                                    className="mt-1 mb-3"
                                    onChange={(e) =>
                                      setProductEdit((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                  />
                                </Label>
                                <Label>
                                  Category
                                  <Select
                                    required
                                    defaultValue={productEdit?.categoryId}
                                    onValueChange={(value) =>
                                      setProductEdit((prev) => ({
                                        ...prev,
                                        categoryId: value,
                                      }))
                                    }
                                  >
                                    <SelectTrigger className="w-full mt-1 mb-3">
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>
                                          -- Choose Category --
                                        </SelectLabel>
                                        {category.map((c) => {
                                          return (
                                            <>
                                              <SelectItem
                                                key={c._id}
                                                value={c._id}
                                              >
                                                {c.name}
                                              </SelectItem>
                                            </>
                                          );
                                        })}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </Label>

                                <Label
                                  htmlFor="price_buy"
                                  className="text-right"
                                >
                                  Price Buy
                                  <Input
                                    required
                                    value={productEdit.price_buy}
                                    id="price_buy"
                                    className="mt-1 mb-3"
                                    type="number"
                                    onChange={(e) =>
                                      setProductEdit((prev) => ({
                                        ...prev,
                                        price_buy: Number(e.target.value),
                                      }))
                                    }
                                  />
                                </Label>

                                <Label
                                  htmlFor="price_sell"
                                  className="text-right"
                                >
                                  Price Sell
                                  <Input
                                    required
                                    value={productEdit.price_sell}
                                    id="price_sell"
                                    className="mt-1 mb-3"
                                    type="number"
                                    onChange={(e) =>
                                      setProductEdit((prev) => ({
                                        ...prev,
                                        price_sell: Number(e.target.value),
                                      }))
                                    }
                                  />
                                </Label>

                                <Label htmlFor="stock" className="text-right">
                                  Stock
                                  <Input
                                    required
                                    id="stock"
                                    value={productEdit.stock}
                                    className="mt-1 mb-3"
                                    type="number"
                                    onChange={(e) =>
                                      setProductEdit((prev) => ({
                                        ...prev,
                                        stock: e.target.value,
                                      }))
                                    }
                                  />
                                </Label>

                                <Label
                                  htmlFor="description"
                                  className="text-right"
                                >
                                  Description
                                  <Textarea
                                    required
                                    value={productEdit.description}
                                    id="description"
                                    className="mt-1 mb-3"
                                    onChange={(e) =>
                                      setProductEdit((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                      }))
                                    }
                                  />
                                </Label>

                                <Label>
                                  Image
                                  <br />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="mb-6"
                                    onChange={(e) =>
                                      setProductEditImg(
                                        (prev) => e.target.files[0]
                                      )
                                    }
                                  />
                                </Label>
                                <div className="flex justify-end">
                                  <Button className="w-full" type="submit">
                                    Save
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => handleDelete(product._id)}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-bold">
                                <div className="mb-3">Delete Confirmation</div>
                                <hr />
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                <div className="mb-6 mt-3">
                                  Delete{" "}
                                  <span className="font-bold">
                                    {`${selectedProduct.name}`}
                                  </span>
                                  ?
                                </div>
                                <div className="mb-3">
                                  Type "DELETE" to delete
                                </div>
                                <Input
                                  placeholder="Type here..."
                                  onChange={handleDeleteDialog}
                                />
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setDeleteDialog("")}
                              >
                                Cancel
                              </AlertDialogCancel>

                              {deleteDialog === "delete" && (
                                <>
                                  <AlertDialogAction
                                    onClick={handleDeleteItem}
                                    variant="destructive"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </>
                              )}
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
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
  );
};
