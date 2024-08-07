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
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const Signin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  type SignInFormType = z.infer<typeof signInSchema>;

  //zod implementation
  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (formData: SignInFormType) => {
    try {
      setIsSubmitting(true);
      const response = await signIn("credentials", {
        redirect: false,
        identifier: formData.identifier,
        password: formData.password,
      });
      if (response?.error) {
        toast({
          description: response?.error || "Incorrect  username or password",
        });
      }

      if (response?.status === 200) {
        toast({ description: "Signin Successfull!" });
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error(`Error while submitting form ${JSON.stringify(error)}`);
      toast({ description: "Something went wrong" }); //TODO: error message
    } finally {
      setIsSubmitting(false);
    }
    console.log(`${JSON.stringify(formData)}`);
  };

  return (
    <Form {...form}>
      <div className=" flex justify-center p-4 pt-8 ">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="shadow-2xl  rounded-md border flex flex-col p-8 sm:w-[450px]"
        >
          <div className="text-3xl my-2 font-bold text-center">
            Welcome to Honest Insights
          </div>
          <div className="text-center  mt-4">
            Sign in to continue your secret conversations
          </div>
          <div className="space-y-6 flex flex-col mt-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Email / Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email / Username" />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" flex flex-col space-y-4">
              <Button
                className="font-bold"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex gap-2">
                    <span>Loading</span>
                    <Loader className="animate-spin" />
                  </div>
                ) : (
                  "SigIn"
                )}
              </Button>
              <div className="flex items-center gap-4 ">
                <div className="border flex-1"></div>
                <div>Or</div>
                <div className="border flex-1"></div>
              </div>
              <div className="flex flex-col sm:flex-row  items-center -mt-4 gap-4 justify-center ">
                <Button
                  className="font-semibold flex-1 w-full"
                  type="button"
                  onClick={() => signIn("github")}
                >
                  SignIn with Github
                  <Image
                    className="ml-2"
                    height={20}
                    width={20}
                    src={"/github-logo.png"}
                    alt="logo"
                  />
                </Button>
                <Button
                  className="font-semibold flex-1 w-full"
                  type="button"
                  onClick={() => signIn("google")}
                >
                  SignIn with Google
                  <Image
                    className="ml-2"
                    height={20}
                    width={20}
                    src={"/google.png"}
                    alt="logo"
                  />
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center my-4">
            {`Don't have an account ?  `}
            <Link className=" text-blue-600 font-semibold" href="/sign-up">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default Signin;
