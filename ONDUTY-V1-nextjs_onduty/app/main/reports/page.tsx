"use client";

import { useEffect, useState } from "react";
import Searchbar from "@/app/components/Searchbar";
import Image from "next/image";
import defaultProfile from "@/app/images/profile.webp";
import Gobtn from "@/app/components/Gobtn";
import Crossicon from "@/app/components/Crossicon";
import Deletebtn from "@/app/components/Deletebtn";
import { getAdminReports, getReportImage, deleteReport, fetchEmployeeProfilePhoto } from "@/app/backend-api/api";

const Page = () => {
  const [searchText, setSearchText] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const photoCache: Record<string, any> = {};

  /* -------------------------------------------------------
     LOAD REPORTS + EMPLOYEE PHOTOS + REPORT IMAGES
  ------------------------------------------------------- */
  const loadReports = async () => {
    try {
      setLoading(true);

      const res = await getAdminReports();
      let data = res?.reports || [];

      console.log("ADMIN REPORTS:", data);

      // Get unique employee emails
      const uniqueEmails = [
        ...new Set(data.map((r: any) => r.employeeEmail).filter(Boolean)),
      ];

      /* ----------------------------------------
         FETCH EMPLOYEE PHOTOS (Promise.all)
      ---------------------------------------- */
      await Promise.all(
        uniqueEmails.map(async (email) => {
          if (!photoCache[email as any]) {
            photoCache[email as any] = await fetchEmployeeProfilePhoto(email as any);
          }
        })
      );

      /* ----------------------------------------
         FETCH REPORT IMAGES (Promise.all)
      ---------------------------------------- */
      const updated = await Promise.all(
        data.map(async (item: any) => {
          const reportImg = await getReportImage(item._id);

          return {
            ...item,
            userImage: photoCache[item.employeeEmail] || defaultProfile,
            reportImage: reportImg,
          };
        })
      );

      setReports(updated);
    } catch (err) {
      console.error("❌ Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  /* -------------------------------------------------------
     SEARCH BY EMPLOYEE NAME
  ------------------------------------------------------- */
  const filteredReports = reports.filter((r) => {
    const text = searchText.toLowerCase();
    return (
      r.employeeName?.toLowerCase().includes(text) ||
      r.clientName?.toLowerCase().includes(text)
    );
  });

  /* -------------------------------------------------------
      DELETE REPORT
  ------------------------------------------------------- */
  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this report?");
    if (!ok) return;

    await deleteReport(id);
    await loadReports();

    setOpenEmpModal(false);
    setSelectedEmployee(null);
  };


  return (
    <div className="flex flex-col p-2.5 gap-5 h-screen">
      <p className="font-semibold text-2xl text-(--color-primary) px-2.5 pt-2.5">Reports</p>

      <div className="px-2.5">
        <Searchbar placeholder="Search Reports..." value={searchText} onChange={setSearchText} />
      </div>

      <div className="overflow-y-auto grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-2.5 pb-5 pt-1.5">
        {filteredReports.length === 0 ? (
          <p className="font-medium text-(--color-gray) ml-3">No reports found</p>
        ) : (
          filteredReports.map((r) => (
            <div key={r._id} className="bg-(--color-sidebar) rounded-3xl p-4 shadow-lg hover:scale-105 transition hover:bg-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex w-[75px] h-[75px]">
                  <Image src={r.userImage || defaultProfile} alt="Employee profile" width={75} height={75} className="rounded-xl object-cover" />
                </div>
                <Gobtn onClick={() => { setSelectedEmployee(r); setOpenEmpModal(true); }} />
              </div>

              <p className="mt-4 text-[18px] font-semibold">{r.employeeName}</p>

              <div className="flex flex-col">
                <p className="mt-1 font-medium text-(--color-gray)">Client : {r.clientName}</p>
                <p className="mt-1 font-medium text-(--color-gray)">{r.date}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ------------------ MODAL ------------------ */}
      {openEmpModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-(--color-sidebar) p-5 rounded-4xl w-[400px] shadow-xl">
            <div className="flex justify-between w-[140px] h-[140px]">
              <Image src={selectedEmployee.userImage || defaultProfile} alt="Employee profile" width={140} height={140} className="rounded-xl object-cover" />
            </div>

            <p className="mt-6 text-[20px] font-semibold">{selectedEmployee.employeeName}</p>
            <p className="mt-2 font-medium text-(--color-gray)">Client : {selectedEmployee.clientName}</p>
            <p className="mt-2 font-medium text-(--color-gray)">Purpose : {selectedEmployee.purpose}</p>
            <p className="mt-2 font-medium text-(--color-gray)">Notes : {selectedEmployee.notes}</p>
            <p className="mt-2 font-medium text-(--color-gray)">Date : {selectedEmployee.date}</p>

            <div className="flex mt-6 justify-between items-end">
              <div className="flex justify-between w-[75px] h-[75px]" onClick={() => { setPreviewImage(selectedEmployee.reportImage); setOpenImageModal(true); }}>
                <Image src={selectedEmployee.reportImage || defaultProfile} alt="Employee profile" width={75} height={75} className="rounded-xl  object-cover" />
              </div>
              <Deletebtn onClick={() => handleDelete(selectedEmployee._id)} />
            </div>

            <div className="absolute top-4 right-4">
              <Crossicon onClick={() => setOpenEmpModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* ---------------- IMAGE PREVIEW MODAL ---------------- */}
      {openImageModal && previewImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <Image src={previewImage} alt="Report Image" fill className="object-contain rounded-2xl" />

          <div className="absolute top-4 right-4">
            <Crossicon onClick={() => setOpenImageModal(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Page;
