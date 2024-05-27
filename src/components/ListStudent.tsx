import { useEffect, useState } from "react";
import Form from "./Form";
import Modal from "./Modal";
import { saveData } from "../utils/saveData";
import { useDebounce } from "../hooks/useDebounce";

type Student = {
  id: number;
  userName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  status: boolean;
};

export default function ListStudent() {
  const [show, setShow] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [idStatus, setIdStatus] = useState<number>(0);
  const [typeForm, setTypeForm] = useState<string>("add");
  const [idEdit, setIdEdit] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [studentsPerPage] = useState<number>(10);

  const [studentLocal, setStudentLocal] = useState<Student[]>(() => {
    const students = localStorage.getItem("students");
    return students ? JSON.parse(students) : [];
  });

  // Logic để tính toán filteredStudents ban đầu
  const calculateInitialFilteredStudents = () => {
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    return studentLocal.slice(indexOfFirstStudent, indexOfLastStudent);
  };

  console.log(calculateInitialFilteredStudents());

  // Sử dụng useState với hàm tính toán filteredStudents ban đầu
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(() =>
    calculateInitialFilteredStudents()
  );

  console.log(filteredStudents);

  // useEffect để cập nhật filteredStudents khi có sự thay đổi trong studentLocal, currentPage, hoặc studentsPerPage
  useEffect(() => {
    setFilteredStudents(calculateInitialFilteredStudents());
  }, [currentPage, studentsPerPage, studentLocal]);

  // Total pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(studentLocal.length / studentsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Thay đổi trang
  const handleClick = (number: number) => {
    setCurrentPage(number);
  };

  // Áp dụng debounce cho giá trị tìm kiếm
  const debouncedSearchTerm = useDebounce(search, 500);

  useEffect(() => {
    // Do something with the debounced search term
    // For example: filter students based on the debounced search term
    if (debouncedSearchTerm) {
      const filtered = studentLocal.filter((student) =>
        student.userName
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(calculateInitialFilteredStudents());
    }
  }, [debouncedSearchTerm, studentLocal]);

  // Hàm mở form thêm mới
  const handleShowForm = (): void => {
    // Cập nhật lại State
    setShow(true);
  };

  // Hàm đóng form thêm mới
  const handleCloseForm = (): void => {
    // Cập nhật lại State
    setShow(false);

    setTypeForm("add");
  };

  const loadData = (students: Student[]) => {
    setStudentLocal(students);
  };

  const handleShowModalDelete = (id: number) => {
    setShowModal(true);
    setIdDelete(id);
  };

  const handleDelete = () => {
    const filterStudents = studentLocal.filter(
      (student) => student.id !== idDelete
    );

    saveData("students", filterStudents);

    setStudentLocal(filterStudents);

    setShowModal(false);
  };

  const handleShowModaStatus = (id: number) => {
    setShowModalStatus(true);
    setIdStatus(id);
  };

  const handleToggleStudent = () => {
    const findIndexStudent = studentLocal.findIndex(
      (student) => student.id === idStatus
    );

    if (findIndexStudent !== -1) {
      studentLocal[findIndexStudent].status =
        !studentLocal[findIndexStudent].status;

      saveData("students", studentLocal);
      setShowModalStatus(false);
      loadData(studentLocal);
    }
  };

  const handleShowFormEdit = (id: number) => {
    setTypeForm("edit");
    setShow(true);
    setIdEdit(id);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {show && (
        <Form
          idEdit={idEdit}
          typeForm={typeForm}
          handleCloseForm={handleCloseForm}
          loadData={loadData}
        />
      )}

      {showModal && (
        <Modal
          title="Xác nhận"
          content="Bạn có chắc chắn xóa sinh viên này không?"
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {showModalStatus && (
        <Modal
          title="Xác nhận"
          content="Bạn có chắc chắn chặn sinh viên này không?"
          onClose={() => setShowModalStatus(false)}
          onConfirm={handleToggleStudent}
        />
      )}

      <div className="w-[80%] m-auto mt-4 h-[100vh]">
        <main className="main">
          <header className="d-flex justify-content-between mb-3">
            <h3>Nhân viên</h3>
            <button onClick={handleShowForm} className="btn btn-primary">
              Thêm mới nhân viên
            </button>
          </header>
          <div className="d-flex align-items-center justify-content-end gap-2 mb-3">
            <input
              style={{ width: 350 }}
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo email"
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="fa-solid fa-arrows-rotate" title="Refresh" />
          </div>
          {/* Danh sách nhân viên */}
          <table className="table table-bordered table-hover table-striped">
            <thead>
              <tr>
                <th className="text-center">STT</th>
                <th className="text-center">Họ và tên</th>
                <th className="text-center">Ngày sinh</th>
                <th className="text-center">Email</th>
                <th className="text-center">Địa chỉ</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center" colSpan={3}>
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student: Student, index: number) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.userName}</td>
                  <td>{student.dateOfBirth}</td>
                  <td>{student.email}</td>
                  <td>{student.address}</td>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        className={`status status-${
                          student.status ? "active" : "stop"
                        }`}
                      />
                      <span>
                        {student.status ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="button button-block"
                      onClick={() => handleShowModaStatus(student.id)}
                    >
                      {student.status ? "Chặn" : "Bỏ chặn"}
                    </span>
                  </td>
                  <td>
                    <span
                      onClick={() => handleShowFormEdit(student.id)}
                      className="button button-edit"
                    >
                      Sửa
                    </span>
                  </td>
                  <td>
                    <span
                      onClick={() => handleShowModalDelete(student.id)}
                      className="button button-delete"
                    >
                      Xóa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer className="d-flex justify-content-end align-items-center gap-3">
            <ul className="pagination">
              <li className="page-item">
                <div className="page-link" onClick={handlePrev}>
                  Prev
                </div>
              </li>
              {pageNumbers.map((number) => (
                <li key={number} className="page-item ">
                  <div
                    className={`page-link ${
                      currentPage === number ? "page-active" : ""
                    }`}
                    onClick={() => handleClick(number)}
                  >
                    {number}
                  </div>
                </li>
              ))}
              <li onClick={handleNext} className="page-item">
                <div className="page-link">Next</div>
              </li>
            </ul>
          </footer>
        </main>
      </div>
    </>
  );
}
