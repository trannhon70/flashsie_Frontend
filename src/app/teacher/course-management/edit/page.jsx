"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { alert } from "@/utils/helpers";
import * as courseAPI from "@/apis/courses";
import * as courseAPINew from "@/apisNew/courses";
import {
  Select,
  SelectItem,
  Input,
  RadioGroup,
  Radio,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import dayjs from "dayjs";
import ImagePickerCrop from "@/components/common/ImagePickerCrop";
import BreadCrumbs from "@/components/layouts/Breadcrumb";
import Image from "next/image";

import * as Yup from "yup";
import * as fileAPI from "@/apis/file";
import config from "@/utils/config";
import constants from "@/utils/constants";

const courseTypes = [
  { key: "join_request", name: constants.course_type_join_request },
  { key: "free", name: constants.course_type_free },
];

const Courses = () => {
  // const { id } = useParams()
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const disabled = useRef(false);
  const [img, setImg] = useState();
  const isNext = useRef(false);

  const [loading, setLoading] = React.useState(true);
  const [state, setState] = React.useState({
    image: "",
    name: "",
    level: "",
    publishAt: dayjs(new Date()).format("YYYY-MM-DD"),
    type: "",
    status: "active",
  });

  const getCourseByIds = () => {
    courseAPINew.getCourseById(id).then((r) => {
      setState({
        name: r.data.name,
        image: r.data.image,
        level: r.data.level,
        publishAt: r.data.publishAt,
        type: r.data.type,
        status: r.data.status,
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    if (id) {
      getCourseByIds();
    } else setLoading(false);
  }, []);

  const createNew = async (value) => {
    setLoading(true);
    const form = new FormData();
    form.append("name", value.name);
    form.append("image", img ? img : "");
    form.append("level", value.level);
    form.append("publishAt", value.publishAt);
    form.append("type", value.type);
    form.append("status", value.status);
    const result = await courseAPINew.create(form);
    if (result.message === "Create successfully") {
      setLoading(false);
      alert.success("Course has been created successfully!");
      // if (isNext.current) {
      setState({
        image: "",
        name: "",
        level: "",
        publishAt: dayjs(new Date()).format("YYYY-MM-DD"),
        type: "",
        status: "active",
      });
      disabled.current = false;
      // } else {
      queryClient.refetchQueries(["course-management"]);
      router.replace(
        `/teacher/course-management/${result.data.id}/flashsets?action=newflashset`
      );
      // }
    }
    setLoading(false);
  };

  const update = async (value) => {
    const form = new FormData();
    form.append("name", value.name);
    form.append("image", img);
    form.append("level", value.level);
    form.append("publishAt", value.publishAt);
    form.append("type", value.type);
    form.append("status", value.status);
    const result = await courseAPINew.update(id, form);
    if (result.message === "Update successfully") {
      setLoading(false);
      alert.success("Course has been updated successfully!");
      queryClient.refetchQueries(["course-management"]);
      router.replace("/teacher/course-management");
    } else {
      setLoading(false);
      disabled.current = false;
      alert.error("Failed to update!");
    }
    setLoading(false);
  };

  // const update = useMutation((values) => courseAPINew.update(id, values), {
  //   onMutate: async (values) => {
  //     disabled.current = true;
  //     if (values.image?.includes?.("blob:")) {
  //       values.image = await fileAPI
  //         .uploads([values.image])
  //         .then((r) => r[0].url);
  //     }
  //     return values;
  //   },
  //   onSuccess: (res) => {
  //     alert.success("Course has been updated successfully!");
  //     queryClient.refetchQueries(["course-management"]);
  //     router.replace("/teacher/course-management");
  //   },
  //   onError: (error) => {
  //     disabled.current = false;
  //     console.log(error);
  //     alert.error("Failed to update!");
  //   },
  // });

  const handleSubmit = (values) => {
    if (disabled.current) return;
    values.publishAt = new Date(values.publishAt).toISOString();

    if (!id) {
      createNew(values);
      // create.mutate(values);
    } else update(values);
    // if (!id) create(values);
    // else update.mutate(values);
  };
  const editSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "From 3 to 30 character")
      .max(30, "From 3 to 30 character")
      .required("Enter " + constants.label_course_name),
    image: Yup.string().required("Image required"),
    publishAt: Yup.string().required(
      constants.label_publish_date + " required"
    ),
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
                <div className="flex flex-row">
                  <div className="mr-2 flex flex-1 flex-col">
                    <Input
                      type="text"
                      label={constants.label_course_name}
                      placeholder={"Enter " + constants.label_course_name}
                      className="my-2"
                      name="name"
                      value={values.name || ""}
                      errorMessage={errors.name}
                      onChange={handleChange}
                    />
                    <Input
                      type="date"
                      label={constants.label_publish_date}
                      placeholder={constants.format_date}
                      className="my-2"
                      name="publishAt"
                      value={dayjs(values.publishAt).format("YYYY-MM-DD")}
                      errorMessage={errors.publishAt}
                      onChange={handleChange}
                    />
                    <Select
                      label={constants.label_course_level}
                      name="level"
                      defaultSelectedKeys={
                        values.level ? [values.level] : undefined
                      }
                      className="my-2"
                      errorMessage={errors.level}
                      onChange={handleChange}
                    >
                      {config.levels.map((lv) => (
                        <SelectItem key={lv.id} value={lv.id}>
                          {lv.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      name="type"
                      label={constants.label_access_ability}
                      className="my-2"
                      defaultSelectedKeys={
                        values.type ? [values.type] : undefined
                      }
                      errorMessage={errors.type}
                      onChange={handleChange}
                    >
                      {courseTypes.map((type) => (
                        <SelectItem key={type.key} value={type.key}>
                          {type.name}
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
                      {id && (
                        <div className="flex flex-row">
                          <Input
                            disabled
                            color="default"
                            type="text"
                            defaultValue={id}
                            placeholder=""
                            className="mt-6 max-w-xs"
                          />
                          <Button className="ml-4 mt-6 w-max">Copy</Button>
                        </div>
                      )}
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
                      onChange={({ blobUrl }) => {
                        setFieldValue("image", blobUrl);
                      }}
                      setImg={setImg}
                    >
                      {!!values.image && (
                        <Image
                          src={values?.image}
                          className="aspect-square w-full border-1"
                          width={100}
                          height={100}
                        />
                      )}
                    </ImagePickerCrop>
                  </div>
                </div>

                <Button
                  type="submit"
                  color="primary"
                  className="mt-6 w-max"
                  isLoading={update.isLoading || loading}
                  onClick={handleSubmit}
                >
                  {!id ? "Create" : "Update"}
                </Button>
              </div>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
};

export default Courses;
