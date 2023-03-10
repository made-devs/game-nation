import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "react-spinners/HashLoader";
import axios from "../api/axios";
import Head from "next/head";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import Image from "next/image";
import { autoTable } from "jspdf-autotable";
import { Leaderboard } from "../../components/database";
import logoUser from "../../public/asset/logo-user.png";

const Profile = () => {
  const tokenJwt = useSelector((state) => state.jwt);
  const router = useRouter();
  const { profileId } = router.query;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [id, setId] = useState("");
  const history = user.GameHistories;

  let info = [];

  useEffect(() => {
    const getId = localStorage.getItem("id");
    setId(getId);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, [profileId]);

  useEffect(() => {
    if (!router.isReady) return;
    axios
      .get("/user/profile/" + profileId, {
        headers: { Authorization: tokenJwt.tokenJwt },
      })
      .then((user) => {
        setUser(user.data.data);
      })
      .catch((err) => router.push("/login"));
  }, [router.isReady]);

  const date = new Date(user.dob);
  const newDate = date.toLocaleString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  const pageURL = "gamenation.my.id";
  //const twitterAPI = `https://twitter.com/intent/tweet?text=${pageURL}, Let's play and show your skill here!`;
  const twitterAPI = `https://twitter.com/intent/tweet?text=${pageURL}, Testing API 2!`;

  const pdfGenerate = () => {
    let doc = new jsPDF("portrait", "px", "a4", "false");
    doc.setFont("Helvetica", "bold");
    doc.text(130, 60, "Name");
    doc.text(130, 80, "Email");
    doc.text(130, 100, "City");
    doc.text(130, 120, "DoB");
    doc.text(170, 60, ":");
    doc.text(170, 80, ":");
    doc.text(170, 100, ":");
    doc.text(170, 120, ":");
    doc.setFont("Helvetica", "normal");
    doc.text(180, 60, user.full_name);
    doc.text(180, 80, user.email);
    doc.text(180, 100, user.city);
    doc.text(180, 120, newDate);
    doc.autoTable({
      startY: 150,
      head: [["Name", "Date", "Title"]],
      body: info,
    });

    doc.save("profile.pdf");
  };

  return (
    <>
      <Head>
        <title>Game Nation - Profile</title>
      </Head>
      {history &&
        history.map((element) => {
          info.push([user.full_name, element.gameplay, element.game_title]);
        })}
      <a href="/dashboard">
        <div className="absolute inline-block text-sm group mt-5 ml-5">
          <span className="relative z-10 block px-1 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
            <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
            <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
            <span className="relative">Home</span>
          </span>
          <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
        </div>
      </a>
      <section className=" min-h-screen flex flex-col justify-center bg-[url('/asset/bg-profile.png')] bg-cover">
        {loading ? (
          <div className="flex flex-col items-center ml-[-10px] mt-[-40px]">
            <Loader color={"#0b1c0f"} loading={loading} size={100} aria-label="Loading Spinner" data-testid="loader" />
            <p className="text-black font-bold ml-[10px] text-2xl mt-[30px]">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-center font-bold text-3xl mt-10">Profile</div>

            <div className="w-[300px] h-[720px] mx-auto flex flex-col md:w-[600px] ">
              <div data-id="0" className=" w-[300px] h-[290px] md:w-[600px] md:h-[350px] mt-4 relative inline-block px-4 py-2 font-medium group">
                <span className="absolute inset-0 w-full h-full   translate-x-1 translate-y-1 bg-black "></span>
                <span className="absolute inset-0 w-full h-full bg-slate-600 border-2 border-black "></span>
                <span className="relative text-white">
                  <div className="mx-5 md:mx-20 mt-[40px] text-center">
                    <img src={user.pict != null ? `/uploads/${user.pict}` : "/asset/logo-user.png"} className=" ml-[154px] mt-[-15px] w-[100px] h-[100px] mb-2 rounded-full" alt="avatar" />
                    <p className="text-2xl font-medium">{user.full_name}</p>
                    <p className="text-sm font-small">{user.email}</p>
                    <p className="text-sm font-small">{newDate}</p>
                    <p className="text-sm font-small">{user.city}</p>
                  </div>
                </span>
              </div>
              <a href={twitterAPI}>
                <button className="absolute inline-block px-2 py-1 ml-[105px] md:ml-[125px] mt-[-100px] md:mt-[-90px] group  ">
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
                  <span className="relative text-black text-sm md:text-md group-hover:text-white">Share on Twitter</span>
                </button>
              </a>
              <a href={"/edit/" + id}>
                <button className="absolute inline-block px-2 py-1 ml-[105px] md:ml-[260px] mt-[-100px] md:mt-[-90px] group  ">
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
                  <span className="relative text-black text-sm md:text-md group-hover:text-white">Edit Profile</span>
                </button>
              </a>
              <button onClick={pdfGenerate} className="absolute inline-block px-2 py-1 ml-[93px] md:ml-[360px] mt-[200px] md:mt-[270px] group  ">
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
                <span className="relative text-black text-sm md:text-md group-hover:text-white">Download PDF</span>
              </button>

              <div className="overflow-x-auto relative mt-3 shadow-md sm:rounded-lg">
                <h3 className="text-center text-xl mt-2">Game History</h3>
                {!history ? (
                  <h3 className="text-center">No Record</h3>
                ) : (
                  <div>
                    <table className="w-full text-sm text-left text-gray-500 mt-3">
                      <thead className="text-xs uppercase   bg-gray-700  text-gray-400 text-center">
                        <tr>
                          <th scope="col" className="py-3 px-6">
                            Name
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Date
                          </th>
                          <th scope="col" className="py-3 px-6">
                            Game
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {history &&
                          history.map((result, i) => {
                            return (
                              <tr key={i} className="border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                                <th scope="row" className="py-4 px-6 font-medium whitespace-nowrap text-white">
                                  {user.full_name}
                                </th>
                                <td className="py-4 px-6">{result.gameplay}</td>
                                <td className="py-4 px-6">{result.game_title}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Profile;
