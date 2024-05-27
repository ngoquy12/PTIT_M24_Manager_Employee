import React, { useEffect, useState } from "react";
import { validateEmail } from "../utils/validateData";
import { saveData } from "../utils/saveData";
import { formatDate } from "../utils/formatDate";

type PropTypes = {
  handleCloseForm: () => void;
  loadData: (students: Student[]) => void;
  typeForm: string;
  idEdit: number;
};

type Student = {
  id: number;
  userName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  status: boolean;
};

export default function Form({
  handleCloseForm,
  loadData,
  typeForm,
  idEdit,
}: PropTypes) {
  const [studentLocal, setStudentLocal] = useState<Student[]>(() => {
    const students = localStorage.getItem("students");
    return students ? JSON.parse(students) : [];
  });

  const [student, setStudent] = useState<Student>({
    id: 0,
    userName: "",
    dateOfBirth: "",
    email: "",
    address: "",
    status: true,
  });
  const [userNameError, setUserNameError] = useState<string>("");
  const [dateOfBirthError, setDateOfBirthError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  useEffect(() => {
    const findStudent = studentLocal.find((student) => student.id === idEdit);

    if (findStudent) {
      setStudent(findStudent);
    }
  }, [idEdit]);

  // Hàm validate dữ liệu đầu vào
  const validateDate = (value: string, name: string): boolean => {
    let isValid = true;

    if (name === "userName") {
      if (!value) {
        setUserNameError("Tên không được để trống");
        isValid = false;
      } else {
        setUserNameError("");
      }
    }

    if (name === "dateOfBirth") {
      if (!value) {
        setDateOfBirthError("Ngày sinh không được để trống");
        isValid = false;
      } else {
        if (formatDate(value) > formatDate(new Date().toString())) {
          setDateOfBirthError("Ngày sinh không được lớn hơn ngày hiện tại");
          isValid = false;
        } else {
          setDateOfBirthError("");
        }
      }
    }

    if (name === "email") {
      if (!value) {
        setEmailError("Email không được để trống");
        isValid = false;
      } else {
        if (!validateEmail(value)) {
          setEmailError("Email không đúng định dạng");
        } else {
          setEmailError("");
        }
      }
    }

    return isValid;
  };

  // Hàm lấy dữ liệu trong ô input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;

    // Cập nhật lại state của student
    setStudent({
      ...student,
      [name]: value,
    });

    // Gọi hàm Validate khi onChange từng ô input
    validateDate(value, name);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    const isUserNameValid = validateDate(student.userName, "userName");
    const isDateOfBirthValid = validateDate(student.dateOfBirth, "dateOfBirth");
    const isEmailValid = validateDate(student.email, "email");

    if (isUserNameValid && isDateOfBirthValid && isEmailValid) {
      if (typeForm === "add") {
        const updatedStudentList = [
          ...studentLocal,
          { ...student, id: Math.ceil(Math.random() * 100000) },
        ];
        setStudentLocal(updatedStudentList);
        saveData("students", updatedStudentList);
        loadData(updatedStudentList);
        handleCloseForm();
      } else {
        const findIndexStudent = studentLocal.findIndex(
          (student) => student.id === idEdit
        );

        if (findIndexStudent !== -1) {
          studentLocal[findIndexStudent].userName = student.userName;
          studentLocal[findIndexStudent].dateOfBirth = student.dateOfBirth;
          studentLocal[findIndexStudent].email = student.email;
          studentLocal[findIndexStudent].address = student.address;

          saveData("students", studentLocal);

          handleCloseForm();

          loadData(studentLocal);
        }
      }
    }
  };

  return (
    <>
      {/* Form thêm mới nhân viên */}
      <div className="overlay">
        <form className="form" onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center">
            <h4>{typeForm === "add" ? "Thêm mới" : "Cập nhật"} nhân viên</h4>
            <i onClick={handleCloseForm} className="fa-solid fa-xmark" />
          </div>
          <div>
            <label className="form-label" htmlFor="userName">
              Họ và tên
            </label>
            <input
              value={student.userName}
              onChange={handleChange}
              type="text"
              className="form-control"
              name="userName"
            />
            {userNameError && (
              <div className="form-text error">{userNameError}</div>
            )}
          </div>
          <div>
            <label className="form-label" htmlFor="dateOfBirth">
              Ngày sinh
            </label>
            <input
              value={student.dateOfBirth}
              onChange={handleChange}
              name="dateOfBirth"
              type="date"
              className="form-control"
            />
            {dateOfBirthError && (
              <div className="form-text error">{dateOfBirthError}</div>
            )}
          </div>
          <div>
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              value={student.email}
              onChange={handleChange}
              name="email"
              type="text"
              className="form-control"
            />
            {emailError && <div className="form-text error">{emailError}</div>}
          </div>

          <div>
            <label className="form-label" htmlFor="address">
              Địa chỉ
            </label>
            <textarea
              value={student.address}
              onChange={handleChange}
              name="address"
              className="form-control"
              rows={3}
            />
          </div>
          <div>
            {typeForm === "add" ? (
              <button type="submit" className="w-100 btn btn-primary">
                Thêm mới
              </button>
            ) : (
              <button type="submit" className="w-100 btn btn-primary">
                Cập nhật
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
