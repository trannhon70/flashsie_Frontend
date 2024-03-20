import { SessionStore } from "@/config/sesstionStore";

export async function getServerSideProps(context) {
  const { req, res } = context;
  const { cookies } = req;

  // Kiểm tra cookie lưu trữ thông tin đăng nhập
  // const isLoggedIn = cookies.get('isLoggedIn');
  const isLoggedIn = SessionStore.getUserSession();
  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!isLoggedIn) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Tiếp tục xử lý các trang khác
  return {
    props: {},
  };
}
