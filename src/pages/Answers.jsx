import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Slider, Skeleton, message, Drawer, Tag, Button, Alert } from "antd";
import { Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import "antd/dist/antd.css";
import { MoreOutlined } from "@ant-design/icons";
import "../index.css";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { data } from "autoprefixer";

const Answers = () => {
  const [questions, setQuestions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [subject, setSubject] = useState("");
  const [confidence, setConfidence] = useState(0);

  const [search, setSearch] = useState("");

  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  // listing all the answers from firebase firestore
  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(collection(db, "questions"));
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getQuestions();
  }, []);

  // check if question has no answer
  const checkQuestion = (question) => {
    if (question.answer === "") {
      return false;
    } else {
      return true;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "questions", id));
      message.success("Question deleted successfully");
    } catch (error) {
      message.error("Question not deleted");
    }
  };

  // filter questions by subject
  const handleFilter = async (e) => {
    e.preventDefault();
    if (subject === "all") {
      const data = await getDocs(collection(db, "questions"));
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } else {
      try {
        const data = await getDocs(collection(db, "questions"));
        const filteredQuestions = data.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((question) => question.subject === subject);
        setQuestions(filteredQuestions);
      } catch (error) {
        message.error("Questions not filtered");
      }
    }
  };

  // handle approve answer
  const handleApprove = async (id) => {
    try {
      const docRef = doc(db, "questions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.approvedBy.includes(user.email)) {
          message.error("You have already approved this answer");
        } else if (data.disapprovedBy.includes(user.email)) {
          await updateDoc(docRef, {
            approvedBy: [...data.approvedBy, user.email],
            confidence: data.confidence + 1,
            disapprovedBy: data.disapprovedBy.filter(
              (email) => email !== user.email
            ),
          });
          message.success("Answer approved successfully");
        } else {
          await updateDoc(docRef, {
            approvedBy: [...data.approvedBy, user.email],
            confidence: data.confidence + 1,
          });
          message.success("Answer approved successfully");
        }
      } else {
        message.error("Question not found");
      }
    } catch (error) {
      message.error("Answer not approved");
    }
  };

  // handle disapprove answer
  const handleDisapprove = async (id) => {
    try {
      const docRef = doc(db, "questions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.disapprovedBy.includes(user.email)) {
          message.error("You have already disapproved this answer");
        } else if (data.approvedBy.includes(user.email)) {
          await updateDoc(docRef, {
            disapprovedBy: [...data.disapprovedBy, user.email],
            confidence: data.confidence - 1,
            approvedBy: data.approvedBy.filter((email) => email !== user.email),
          });
          message.success("Answer disapproved successfully");
        } else {
          await updateDoc(docRef, {
            disapprovedBy: [...data.disapprovedBy, user.email],
            confidence: data.confidence - 1,
          });
          message.success("Answer disapproved successfully");
        }
      } else {
        message.error("Question not found");
      }
    } catch (error) {
      message.error("Answer not disapproved");
    }
  };

  return (
    <div className="">
      <div className="">
        <Link to="/account">
          <button className="border px-6 py-2 my-4">Ask Question</button>
        </Link>
        {/* <input type="text" placeholder="Search" className="border p-2 my-2" style={{width: '799px'}} onChange={(e) => setSearch(e.target.value)} />
        <button className="border px-6 py-2 my-4" onClick={searchQuestions}>Search</button> */}
        <select
          onChange={(e) => setSubject(e.target.value)}
          className="border px-6 py-2 my-4"
        >
          <option value="all">All Subjects</option>
          <option value="Maths">Maths</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Science">Science</option>
          <option value="Medical">Medical</option>
          <option value="Languages">Languages</option>
          <option value="Information">Information</option>
          <option value="Law">Law</option>
          <option value="Other">Other</option>
        </select>
        <button onClick={handleFilter} className="border px-6 py-2 my-4">
          Filter
        </button>
        <p className="text-sm">Total Questions: {questions.length}</p>

        {questions.length === 0 ? (
          <div className="">
            <h1 className="text-center">No questions yet</h1>
          </div>
        ) : (
          ""
        )}
        {questions ? (
          questions.map((question) => (
            <div className="border p-4 my-4" key={question.id}>
              <h3 className="text-xl font-bold">
                {question && question.question
                  ? question.question
                  : "No question"}
                {user?.uid === question.createdByUid ? (
                  <div
                    className="flex justify-between"
                    style={{
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      ghost
                      onClick={() => handleDelete(question.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </h3>
              <p className="text-lg">
                {checkQuestion(question) ? question.answer : "No answer yet"}
              </p>
              {checkQuestion(question) ? (
                <p className="text-sm">
                  {" "}
                  Question Subject:{" "}
                  <Tag color="magenta">{question.subject}</Tag>
                </p>
              ) : (
                ""
              )}
              <p className="text-sm">created by {question.createdBy}</p>
              <p className="text-sm">
                created at{" "}
                {question.createdAt
                  ? question.createdAt.toDate().toString()
                  : "loading"}
              </p>
              <p className="text-sm">
                {" "}
                Confidence Score: {question.confidence}
              </p>
              <div
                className="flex footer-btns"
                style={{
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button
                  ghost
                  onClick={() => handleApprove(question.id)}
                  style={{ borderColor: "green", color: "green" }}
                >
                  Approve Answer
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleDisapprove(question.id)}
                  danger
                  ghost
                >
                  Reject Answer
                </Button>
                <Button type="primary" ghost>
                  <a
                    href={`https://www.google.com/search?q=${question.question}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    Search this question on Google
                  </a>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <Skeleton active />
        )}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </div>
  );
};

export default Answers;
