"use client";
import {
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ImagePickerCrop from "@/components/common/ImagePickerCrop";
import BreadCrumbs from "@/components/layouts/Breadcrumb";
import config from "@/utils/config";
import { alert } from "@/utils/helpers";

import * as Yup from "yup";
import * as fileAPI from "@/apis/file";
import * as fileAPINew from "@/apisNew/file";
import * as flashsetAPI from "@/apis/flashsets";
import * as flashsetAPINew from "@/apisNew/flashsets";
import constants from "@/utils/constants";

const FlashsetEditor = () => {
  // const { id } = useParams()
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const disabled = useRef(false);
  const isNextAction = useRef("");
  const [img, setImg] = useState();

  const [loading, setLoading] = React.useState(true);
  const [state, setState] = React.useState({
    name: "",
    type: "fantasy",
    status: "active",
    image: "",
  });

  useEffect(() => {
    if (id) {
      flashsetAPINew.getFlashsetById(id).then((r) => {
        setState({
          name: r.data.name,
          image: r.data.image,
          type: r.data.type,
          status: r.data.status,
        });
        setLoading(false);
      });
    } else setLoading(false);
  }, []);

  const create = useMutation(
    (values) => {
      const form = new FormData();
      form.append("name", values.name);
      form.append("image", img ? img : "");
      form.append("type", values.type);
      form.append("status", values.status);
      return flashsetAPINew.create(form);
    },
    {
      onMutate: async (values) => {
        disabled.current = true;
        // if (values.image?.includes?.("blob:")) {
        //   values.image = await fileAPINew
        //     .uploads([values.image])
        //     .then((r) => r[0].url);
        // }
        // return values;
      },
      onSuccess: (res) => {
        alert.success("Flash set has been created successfully!");
        router.replace(`/teacher/flashset-management/${res?.data?.id}/cards`);
      },
      onError: (error) => {
        disabled.current = false;
        console.log(error);
        alert.error("Failed to create!");
      },
    }
  );

  const update = useMutation(
    (values) => {
      const form = new FormData();
      form.append("name", values.name);
      form.append("image", img ? img : "");
      form.append("type", values.type);
      form.append("status", values.status);
      return flashsetAPINew.update(id, form);
    },
    {
      onMutate: async (values) => {
        disabled.current = true;
        // if (values.image?.includes?.("blob:")) {
        //   values.image = await fileAPI
        //     .uploads([values.image])
        //     .then((r) => r[0].url);
        // }
        // return values;
      },
      onSuccess: (res) => {
        alert.success("Flash set has been updated successfully!");
        queryClient.refetchQueries(["flashset-management"]);
        router.replace("/teacher/flashset-management");
      },
      onError: (error) => {
        disabled.current = false;
        console.log(error);
        alert.error("Failed to update!");
      },
    }
  );

  const handleSubmit = async (values, { resetForm }) => {
    // console.log(values, 'values')

    if (disabled.current) return;

    if (!id) await create.mutateAsync(values);
    else await update.mutateAsync(values);
    resetForm();
  };
  const editSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "From 3 to 30 character")
      .max(30, "From 3 to 30 character")
      .required("Enter " + constants.label_course_name),
    image: Yup.string().required("Image required"),
    type: Yup.string().required("Type required"),
  });

  if (loading) return <Spinner size="lg" />;
  return (
    <>
      <BreadCrumbs />
      <Card>
        <CardBody>
          <Formik
            onSubmit={handleSubmit}
            initialValues={{ ...state }}
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
                <div className="flex flex-row">
                  <div className="mr-2 flex flex-1 flex-col">
                    <Input
                      type="text"
                      label="Flash Set Name"
                      placeholder="Enter flash set name"
                      className="my-2"
                      name="name"
                      value={values.name || ""}
                      errorMessage={errors.name}
                      onChange={handleChange}
                    />
                    <Select
                      label={constants.label_flashset_type}
                      name={"type"}
                      defaultSelectedKeys={
                        values.type ? [values.type] : undefined
                      }
                      className="my-2"
                      onChange={handleChange}
                    >
                      {config.flashsetTypes.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <RadioGroup
                      className="mt-6"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                    >
                      <Radio value="active">Active</Radio>
                      <Radio value="inactive">Inactive</Radio>
                    </RadioGroup>
                  </div>
                  <div className="ml-2 flex flex-1 flex-col">
                    <p>
                      Image:{" "}
                      {errors.image && (
                        <span className="text-sm text-red-500">
                          Image required
                        </span>
                      )}
                    </p>
                    <ImagePickerCrop
                      onChange={({ blobUrl }) =>
                        setFieldValue("image", blobUrl)
                      }
                      setImg={setImg}
                    >
                      {!!values.image && (
                        <Image
                          src={values.image}
                          className="aspect-square w-full border-1"
                        />
                      )}
                    </ImagePickerCrop>
                  </div>
                </div>

                <div className=" flex flex-row">
                  <Button
                    type="submit"
                    color="primary"
                    className="mt-6 w-max"
                    isLoading={update.isLoading || create.isLoading}
                    onClick={() => {
                      // isNext.current = false
                      handleSubmit();
                    }}
                  >
                    {!id ? "Create" : "Update"}
                  </Button>

                  {/* {!id && (
                    <Button
                      type='submit'
                      color='primary'
                      className='ml-4 mt-6 w-max'
                      isLoading={create.isLoading}
                      onClick={() => {
                        isNextAction.current = 'add'

                        handleSubmit()
                      }}
                    >
                      Create anh Add Flash Card
                    </Button>
                  )}
                  {!id && (
                    <Button
                      type='submit'
                      color='primary'
                      className='ml-4 mt-6 w-max'
                      isLoading={create.isLoading}
                      onClick={() => {
                        isNextAction.current = 'import'

                        handleSubmit()
                      }}
                    >
                      Create anh Import Flash Card
                    </Button>
                  )} */}
                </div>
              </div>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
};

export default FlashsetEditor;
