"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { isEmpty, isNumber, isValidEmail, isValidName, isValidPrice } from "@/utils/validation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config/const";

interface City {
  _id: string;
  city_name: string;
}

export default function Home() {
  const router = useRouter();
  const [bidData, setBidData] = useState({
    name: "",
    email: "",
    city: "",
    delivery_address: "",
    price_willing_to_pay: "",
    special_instructions: "",
    payment_type: "",
  });

  const [dataErrors, setDataErrors] = useState({
    name: "",
    email: "",
    city: "",
    delivery_address: "",
    price_willing_to_pay: "",
    special_instructions: "",
    payment_type: "",
  });

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price_willing_to_pay" && !isValidPrice(value) && value !== "")
      return;
    setBidData({ ...bidData, [name]: value });
  };

  const handleClick = async () => {
    setDataErrors(() => ({
      name: "",
      email: "",
      city: "",
      delivery_address: "",
      price_willing_to_pay: "",
      special_instructions: "",
      payment_type: "",
    }));

    let hasError = false;

    if (!isValidName(bidData?.name)) {
      toast.error("Please enter a valid name");
      setDataErrors(prev => ({ ...prev, name: "Please enter a valid name" }));
      hasError = true;
    } else if (!isValidEmail(bidData?.email)) {
      toast.error("Please enter a valid email");
      setDataErrors(prev => ({ ...prev, email: "Please enter a valid email" }));
      hasError = true;
    } else if (isEmpty(bidData?.city)) {
      toast.error("Please select a city");
      setDataErrors(prev => ({ ...prev, city: "Please select a city" }));
      hasError = true;
    } else if (isEmpty(bidData?.delivery_address)) {
      toast.error("Please enter a delivery address");
      setDataErrors(prev => ({ ...prev, delivery_address: "Please enter a delivery address" }));
      hasError = true;
    } else if (isEmpty(bidData?.price_willing_to_pay)) {
      toast.error("Please enter a valid price");
      setDataErrors(prev => ({ ...prev, price_willing_to_pay: "Please enter a valid price" }));
      hasError = true;
    } else if (isEmpty(bidData?.special_instructions)) {
      toast.error("Please enter special instructions");
      setDataErrors(prev => ({ ...prev, special_instructions: "Please enter special instructions" }));
      hasError = true;
    } else if (isEmpty(bidData?.payment_type)) {
      toast.error("Please select a payment type");
      setDataErrors(prev => ({ ...prev, payment_type: "Please select a payment type" }));
      hasError = true;
    } else {
      try {
        setLoading(true);
        const res: AxiosResponse = await axios.post(baseUrl + "/customers/create-bid", bidData);
        if (res.status === 201) {
          toast.success("Bid has been created successfully");
          router.push("/order/success");
        }
      } catch (err: any) {
        const errMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;
        toast.error(errMsg);
        setLoading(false);
      }
    }
  };

  const getAllCities = async () => {
    const res = await axios.get(baseUrl + "/cities");
    if (res?.data?.data) {
      setCities(res.data.data);
    }
  };

  useEffect(() => {
    getAllCities();
  }, []);

  return (
    <div className="bg-slate-50 grainy-light">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-1 xl:pt-1 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-2xl md:text-3xl lg:text-4xl">
                Post a{" "}
                <span className="bg-green-600 px-2 text-white">Bid</span>{" "}
                through OUR NEW BIDDING SYSTEM
              </h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Submit your bid to get the best deal for your desired products.{" "}
                <span className="font-semibold">Receive instant notifications</span>{" "}
                and negotiate with active runners in your city to finalize the deal.
              </p>

              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Bid Submission
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Instant Notification to Runners
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    AI-Driven Negotiations
                  </li>
                </div>
              </ul>

              <div className="mt-20 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex flex-col justify-between items-center md:items-start">
                  <p className="mb-4">Looking to offer delivery services?</p>
                  <Link
                    href="/runners/signup"
                    className={buttonVariants({
                      size: "sm",
                      className: "sm:flex items-center gap-1",
                    })}
                  >
                    Become a Local Runner
                  </Link>

                  <p className="text-xs mt-4">
                    Turn your availability into earnings
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative w-full md:max-w-xl">
              <div className="w-full col-span-full lg:col-span-1 flex flex-col bg-white shadow-md">
                <ScrollArea className="relative flex-1 overflow-auto">
                  <div
                    aria-hidden="true"
                    className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
                  />

                  <div className="px-8 pb-12 pt-8">
                    <h2 className="tracking-tight font-bold text-3xl">
                      Submit Your Bid
                    </h2>

                    <div className="w-full h-px bg-zinc-200 my-6" />

                    <div className="relative mt-4 h-full flex flex-col justify-between">
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={bidData.name}
                              onChange={handleChange}
                              placeholder="Enter your name"
                              required
                            />
                            {dataErrors.name && <p className="text-red-500">{dataErrors.name}</p>}
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={bidData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              required
                            />
                            {dataErrors.email && <p className="text-red-500">{dataErrors.email}</p>}
                          </div>
                          <div>
                            <Label htmlFor="city">City</Label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className={cn(
                                    "w-full justify-between",
                                    !bidData.city && "text-muted-foreground"
                                  )}
                                >
                                  {bidData.city || "Select a city"}
                                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {cities.map((city) => (
                                  <DropdownMenuItem
                                    key={city._id}
                                    onClick={() => setBidData({ ...bidData, city: city.city_name })}
                                  >
                                    {city.city_name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            {dataErrors.city && <p className="text-red-500">{dataErrors.city}</p>}
                          </div>
                          <div>
                            <Label htmlFor="delivery_address">Delivery Address</Label>
                            <Input
                              id="delivery_address"
                              name="delivery_address"
                              type="text"
                              value={bidData.delivery_address}
                              onChange={handleChange}
                              placeholder="Enter your delivery address"
                              required
                            />
                            {dataErrors.delivery_address && <p className="text-red-500">{dataErrors.delivery_address}</p>}
                          </div>
                          <div>
                            <Label htmlFor="price_willing_to_pay">Price Willing to Pay</Label>
                            <Input
                              id="price_willing_to_pay"
                              name="price_willing_to_pay"
                              type="text"
                              value={bidData.price_willing_to_pay}
                              onChange={handleChange}
                              placeholder="Enter the price you are willing to pay"
                              required
                            />
                            {dataErrors.price_willing_to_pay && <p className="text-red-500">{dataErrors.price_willing_to_pay}</p>}
                          </div>
                          <div>
                            <Label htmlFor="special_instructions">Special Instructions</Label>
                            <Input
                              id="special_instructions"
                              name="special_instructions"
                              type="text"
                              value={bidData.special_instructions}
                              onChange={handleChange}
                              placeholder="Enter any special instructions"
                              required
                            />
                            {dataErrors.special_instructions && <p className="text-red-500">{dataErrors.special_instructions}</p>}
                          </div>
                          <div>
                            <Label htmlFor="payment_type">Payment Type</Label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className={cn(
                                    "w-full justify-between",
                                    !bidData.payment_type && "text-muted-foreground"
                                  )}
                                >
                                  {bidData.payment_type || "Select a payment type"}
                                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => setBidData({ ...bidData, payment_type: "Credit Card" })}
                                >
                                  Credit Card
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setBidData({ ...bidData, payment_type: "Debit Card" })}
                                >
                                  Debit Card
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setBidData({ ...bidData, payment_type: "PayPal" })}
                                >
                                  PayPal
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            {dataErrors.payment_type && <p className="text-red-500">{dataErrors.payment_type}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-8">
                        <Button
                          onClick={handleClick}
                          disabled={loading}
                          className="flex items-center gap-2"
                        >
                          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Bid"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
