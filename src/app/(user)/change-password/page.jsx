"use client";
import { alert } from "@/utils/helpers";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useParams } from "next/navigation";

import * as authAPINew from "@/apisNew/auth";
import * as Yup from "yup";

const Profile = () => {
  const { id } = useParams();

  const update = useMutation(
    (values) =>
      authAPINew.changePassword(
        values.oldPassword,
        values.newPassword,
        values.confirmNewPassword
      ),
    {
      // onMutate: async (values) => {
      //   if (avt) {
      //     values.avatar = await courseAPI.upload(avt);
      //   }
      //   return values;
      // },
      onSuccess: (res) => {
        alert.success("Password has been updated successfully!");
      },
      onError: (error) => {
        console.log(error);
        alert.error(error?.response?.data?.message || "Failed to update!");
      },
    }
  );

  const handleSubmit = (values) => {
    if (values.newPassword !== values.confirmNewPassword) {
      alert.error("New Password and Confirm New Password not match!");
      return;
    }
    update.mutate(values);
  };
  const editSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(6, "From 6 to 30 character")
      .max(30, "From 6 to 30 character")
      .required("Enter old password"),
    newPassword: Yup.string()
      .min(6, "From 6 to 30 character")
      .max(30, "From 6 to 30 character")
      .required("Enter new password"),
    confirmNewPassword: Yup.string()
      .min(6, "From 6 to 30 character")
      .max(30, "From 6 to 30 character")
      .required("Enter new password"),
  });

  return (
    <Card>
      <CardBody>
        <Formik
          onSubmit={handleSubmit}
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
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
                    type="password"
                    label="Old password"
                    placeholder="Enter old password"
                    className="my-2"
                    name="oldPassword"
                    value={values.oldPassword || ""}
                    errorMessage={errors.oldPassword}
                    onChange={handleChange}
                  />
                  <Input
                    type="password"
                    label="New password"
                    placeholder="Enter new password"
                    className="my-2"
                    name="newPassword"
                    value={values.newPassword || ""}
                    errorMessage={errors.newPassword}
                    onChange={handleChange}
                  />
                  <Input
                    type="password"
                    label="Confirm new password"
                    placeholder="Enter new password"
                    className="my-2"
                    name="confirmNewPassword"
                    value={values.confirmNewPassword || ""}
                    errorMessage={errors.confirmNewPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-2 flex flex-1 flex-col"></div>
              </div>

              <Button
                type="submit"
                color="primary"
                className="mt-6 w-max"
                isLoading={update.isLoading}
                onClick={handleSubmit}
              >
                Change
              </Button>
            </div>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};

export default Profile;
