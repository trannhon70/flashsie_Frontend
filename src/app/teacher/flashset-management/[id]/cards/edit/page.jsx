"use client";
import { Button, Card, CardBody, Image, Input } from "@nextui-org/react";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";
import * as fileAPI from "@/apis/file";
import * as flashcard from "@/apis/flashcards";
import * as flashcardNew from "@/apisNew/flashcards";
import * as flashsetsAPI from "@/apis/flashsets";
import * as flashsetsAPINew from "@/apisNew/flashsets";
import ImagePickerCrop from "@/components/common/ImagePickerCrop";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BreadCrumbs from "@/components/layouts/Breadcrumb";
import constants from "@/utils/constants";
import { alert } from "@/utils/helpers";

const FormEditor = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const cardId = searchParams.get("cardId");
  const [img, setImg] = useState();

  const disabled = useRef(false);
  const isNext = useRef(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const [state, setState] = useState({
    name: "",
    frontText: "",
    frontImage: "",
    backText: "",
    backImage: "",
  });

  useEffect(() => {
    if (cardId) {
      flashcardNew.getFlashcardById(cardId).then((r) => {
        setState({
          name: r.data.name,
          frontText: r.data.frontText,
          frontImage: r.data.frontImage,
          backText: r.data.backText,
          backImage: r.data.backImage,
        });
      });
    } else {
      flashsetsAPINew
        .getFlashcards({ id, page: 1, perPage: 10 })
        .then((res) => {
          setState((s) => ({ ...s, name: `Card ${res?.data?.total + 1}` }));
        });
    }
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    if (disabled.current) return;
    values.flashsetId = id;
    if (values.frontText.length == 0) {
      alert.error("Please enter text of front card!");
      return;
    }

    if (values.backText.length == 0 && values.backImage?.length == 0) {
      alert.error("Please enter text or image of back card!");
      return;
    }
    if (!cardId) await create.mutateAsync(values);
    else await update.mutateAsync(values);
    resetForm();
  };

  const create = useMutation(
    (values) => {
      let form = new FormData();
      const data = [];
      data.push({
        backImage: values.backImage,
        flashsetId: values.flashsetId,
        name: values.name,
        frontText: values.frontText,
        backText: values.backText,
        frontImage: img,
      });
      data.forEach((item) => {
        form.append("backImage", item.backImage);
        form.append("flashsetId", item.flashsetId);
        form.append("name", item.name);
        form.append("frontText", item.frontText);
        form.append("backText", item.backText);
        form.append("frontImage", item.frontImage);
      });

      flashcardNew.create(form, id);
    },
    {
      onMutate: async (values) => {
        // disabled.current = true;
        // if (
        //   values.frontImage &&
        //   (typeof values.frontImage === "object" ||
        //     values.frontImage.includes("blob:http"))
        // ) {
        //   values.frontImage = await fileAPI
        //     .uploads([values.frontImage])
        //     .then((r) => r[0].url);
        // }
        // if (
        //   values.backImage &&
        //   (typeof values.backImage === "object" ||
        //     values.backImage.includes("blob:http"))
        // ) {
        //   values.backImage = await fileAPI
        //     .uploads([values.backImage])
        //     .then((r) => r[0].url);
        // }
        // return values;
      },
      onSuccess: () => {
        alert.success("Flashcard has been created successfully!");
        if (isNext.current) {
          disabled.current = false;
          flashsetsAPI
            .getFlashcards({ id, page: 1, perPage: 10 })
            .then((res) => {
              setState((s) => ({ ...s, name: `Card ${res.total + 1}` }));
              return res.data;
            });
        } else {
          queryClient.refetchQueries(["flashset-management"]);
          router.replace(`/teacher/flashset-management/${id}/cards`);
        }
      },
      onError: (error) => {
        // console.log(error);
        disabled.current = false;
        alert.error("Failed to create!");
      },
    }
  );

  const createNew = (values) => {
    let form = new FormData();
    const data = [];
    data.push({
      backImage: values.backImage,
      flashsetId: values.flashsetId,
      name: values.name,
      frontText: values.frontText,
      backText: values.backText,
      frontImage: img,
    });
    data.forEach((item, index) => {
      for (let key in item) {
        form.append(`${key}`, item[key]);
      }
    });

    flashcardNew.create(form, id);
  };

  const update = useMutation(
    (values) => {
      const form = new FormData();
      // form.append("backImage", values.backImage);
      form.append("flashsetId", values.flashsetId);
      form.append("name", values.name);
      form.append("frontText", values.frontText);
      form.append("backText", values.backText);
      form.append("frontImage", img ? img : "");
      return flashcardNew.update(cardId, form);
    },
    {
      onMutate: async (values) => {
        disabled.current = true;
        // if (
        //   values.frontImage &&
        //   (typeof values.frontImage === "object" ||
        //     values.frontImage.includes("blob:http"))
        // ) {
        //   values.frontImage = await fileAPI
        //     .uploads([values.frontImage])
        //     .then((r) => r[0].url);
        // }
        // if (
        //   values.backImage &&
        //   (typeof values.backImage === "object" ||
        //     values.backImage.includes("blob:http"))
        // ) {
        //   values.backImage = await fileAPI
        //     .uploads([values.backImage])
        //     .then((r) => r[0].url);
        // }
        // return values;
      },
      onSuccess: (res) => {
        alert.success("Flashcard has been updated successfully!");
        queryClient.refetchQueries(["flashset-management"]);
        router.replace(`/teacher/flashset-management/${id}/cards`);
      },
      onError: (error) => {
        console.log(error);
        disabled.current = false;
        alert.error("Failed to update!");
      },
    }
  );

  const editSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "From 3 to 30 character")
      .max(30, "From 3 to 30 character")
      .required("Enter name"),
  });

  return (
    <>
      <BreadCrumbs />
      <Card>
        <CardBody>
          <Formik
            onSubmit={handleSubmit}
            initialValues={state}
            enableReinitialize={true}
            validationSchema={editSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <div className="flex w-full flex-col">
                <div className="flex flex-col">
                  <Input
                    type="text"
                    label="Flash card name"
                    placeholder="Enter Flash card name"
                    className="my-2 min-w-[320px]"
                    name="name"
                    errorMessage={errors.name}
                    value={values.name}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col gap-8 md:flex-row">
                    <div className="flex flex-col">
                      <Input
                        type="text"
                        label={constants.fronttext}
                        placeholder={"Enter " + constants.fronttext}
                        className="my-2 min-w-[320px]"
                        name={"frontText"}
                        errorMessage={errors.frontText}
                        value={values.frontText}
                        onChange={handleChange}
                      />
                      {!values?.frontImage ? (
                        <ImagePickerCrop
                          aspect={3 / 4}
                          onChange={({ blobUrl }) => {
                            handleChange({
                              target: {
                                name: "frontImage",
                                value: blobUrl,
                              },
                            });
                          }}
                          setImg={setImg}
                        >
                          <div className="cursor-pointer">
                            <p className="m-2 text-sm">Image: (3x4)</p>
                            <div className="flex h-[420px] w-[320px] flex-row items-center justify-center rounded-xl border-2">
                              <BiImageAdd size={60} color={"#d1d5db"} />
                            </div>
                          </div>
                        </ImagePickerCrop>
                      ) : (
                        <div className="cursor-pointer">
                          <p className="m-2 text-sm">Image: (3x4)</p>
                          <div className="relative border">
                            <Image
                              className="mt-2 max-h-[420px] max-w-[320px]"
                              src={
                                typeof values.frontImage === "string"
                                  ? values.frontImage
                                  : URL.createObjectURL(values.frontImage)
                              }
                            />
                            <Button
                              isIconOnly
                              color="danger"
                              className="absolute right-2 top-2"
                              onClick={() => {
                                handleChange({
                                  target: { name: "frontImage", value: "" },
                                });
                              }}
                            >
                              <IoClose />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <Input
                        type="text"
                        label={constants.backtext}
                        placeholder={"Enter " + constants.backtext}
                        className="my-2 min-w-[320px]"
                        name={"backText"}
                        errorMessage={errors.backText}
                        value={values.backText}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className=" flex flex-row">
                    <Button
                      type="submit"
                      color="primary"
                      className="mt-6 w-max"
                      isLoading={update.isLoading || create.isLoading}
                      onClick={() => {
                        isNext.current = false;
                        handleSubmit();
                      }}
                    >
                      {!cardId ? constants.button_create : "Update"}
                    </Button>

                    {!cardId && (
                      <Button
                        type="submit"
                        color="primary"
                        className="ml-4 mt-6 w-max"
                        isLoading={create.isLoading}
                        onClick={() => {
                          isNext.current = true;
                          handleSubmit();
                        }}
                      >
                        {constants.button_create_and_next}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
};

export default FormEditor;
