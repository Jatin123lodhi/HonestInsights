"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  type SignUpFormType = z.infer<typeof signUpSchema>;

  //zod implementation
  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setUsernameMessage("");
    const checkUserNameUnique = async () => {
      if (username && username.length > 1) {
        setIsCheckingUsername(true);

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          if (response.status === 200) {
            setUsernameMessage(response?.data?.message);
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          if (axiosError.response && axiosError.response.status === 400) {
            setUsernameMessage(
              axiosError.response.data.message || "Username is already taken"
            );
          }
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUserNameUnique();
  }, [username]);

  const onSubmit = async (formData: SignUpFormType) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/sign-up`, formData);
      //let's show toast
      if (response.status === 201) {
        toast({ description: response.data.message });
        router.replace(`/verify/${username}`);
      }
      console.log(`Response : ${JSON.stringify(response)}`);
    } catch (error) {
      console.error(`Error while submitting form ${JSON.stringify(error)}`);
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast({
          description:
            axiosError.response.data.message || "Something went wrong",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
    console.log(`${JSON.stringify(formData)}`);
  };

  return (
    <Form {...form}>
      <div className=" flex justify-center p-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="shadow-lg rounded-md border flex flex-col px-8 py-4 w-[450px]"
        >
          <div className="text-4xl my-2 font-bold text-center">
            Welcome to Honest Insights
          </div>
          <div className="text-center  mt-4">
            Sign up to start your anonymous adventure
          </div>
          <div className="space-y-8 flex flex-col mt-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Username"
                      onChange={(e) => {
                        debounced(e.target.value);
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername ? (
                    <div className="flex items-center gap-2">
                      <span>Loading</span>
                      <Loader className="animate-spin" />
                    </div>
                  ) : usernameMessage ? (
                    <>
                      <p
                        className={`${
                          usernameMessage.includes("unique")
                            ? ""
                            : "text-red-500"
                        } `}
                      >
                        {usernameMessage}
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="font-bold"
              type="submit"
              disabled={isSubmitting || usernameMessage.includes("taken")}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span>Loading</span>
                  <Loader className="animate-spin" />
                </div>
              ) : (
                "Signup"
              )}
            </Button>
            <Button className="font-bold" type="button" onClick={()=>signIn("github")}>Signup with Github <Image className="ml-2" height={20} width={20} src={"/github-logo.png"} alt="logo"/></Button>
          </div>
          <div className="text-center my-4">{`Already a member ?  `}<Link className=" text-blue-600 font-semibold" href="/sign-in">SignIn</Link></div>
        </form>
      </div>
    </Form>
  );
};

export default Signup;
