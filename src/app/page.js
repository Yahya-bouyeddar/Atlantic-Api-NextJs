"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  Eye,
  Download,
  Calendar,
  Building2,
  MapPin,
  User,
  FileCheck,
  Zap,
  FileDown,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/apiFetch";

export default function Home() {
  const projectInputList = [
    { key: "reference_2", label: "BA Reference", placeholder: "BA 318/24", icon: FileCheck },
    { key: "ville", label: "Ville", placeholder: "Casa", icon: MapPin },
    { key: "proprietaire", label: "Propriétaire", placeholder: "Nom du propriétaire", icon: User },
    { key: "projet", label: "Projet", placeholder: "Nom du projet", icon: Building2 },
    { key: "adresse", label: "Adresse", placeholder: "Adresse complète", icon: MapPin },
  ];

  const [documentType, setDocumentType] = useState("BCLG");
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    reference_2: "",
    ville: "",
    proprietaire: "",
    projet: "",
    adresse: "",
    date: "",
    att_reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewData(null);
      setIsFileValid(false);
      showToast("Fichier chargé. Cliquez sur \"Aperçu\" pour valider.", "success");
    }
  };

  async function downloadBonTemplate() {
    try {
      const res = await apiFetch("/api/bon/template", { method: "GET" });
      if (!res.ok) throw new Error("Failed to download Excel");
      const blob = await res.blob();
      const filename = res.headers.get("X-Filename") || "bon_template.xlsx";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Template téléchargé avec succès!", "success");
    } catch (error) {
      showToast("Erreur lors du téléchargement: " + error.message, "error");
    }
  }

  const handlePreview = async () => {
    if (!file) {
      showToast("Veuillez charger un fichier Excel", "warning");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await apiFetch("/api/bon/preview-excel", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setPreviewData(data.rows);
        setIsFileValid(true);
        showToast(`✅ ${data.rows.length} ligne(s) valide(s)`, "success");
      } else {
        setPreviewData(null);
        setIsFileValid(false);
        showToast(data.message || data.details || "Erreur de validation", "error");
      }
    } catch (error) {
      showToast("Erreur: " + error.message, "error");
      setPreviewData(null);
      setIsFileValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (documentType === "BCLG") {
      if (!file) {
        showToast("Veuillez charger un fichier Excel", "warning");
        return;
      }
      if (!isFileValid) {
        showToast("Veuillez d'abord valider le fichier avec \"Aperçu des données\"", "warning");
        return;
      }
    }

    const toCheck = Object.entries(projectInfo).filter(
      ([key]) => documentType === "ATT" || (key !== "date" && key !== "att_reference")
    );
    const missing = toCheck.filter(([, val]) => !val || val === "").map(([key]) => key);
    if (missing.length > 0) {
      showToast("Champs manquants: " + missing.join(", "), "warning");
      return;
    }

    try {
      setLoading(true);
      let response;
      if (documentType === "BCLG") {
        const formData = new FormData();
        formData.append("file", file);
        Object.keys(projectInfo).forEach((key) => {
          if (projectInfo[key]) formData.append(key, projectInfo[key]);
        });
        response = await apiFetch("/api/bon/generate-from-excel", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await apiFetch("/api/bon/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...projectInfo, documentType: "ATT" }),
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        showToast(errData.message || errData.error || "Erreur lors de la génération", "error");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${documentType === "BCLG" ? "bon_coulage" : "attestation"}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("PDF généré avec succès!", "success");
    } catch (error) {
      showToast("Erreur: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === "success" && <CheckCircle size={20} />}
              {(toast.type === "error" || toast.type === "warning") && <AlertCircle size={20} />}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button type="button" className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="main-wrapper">
        <div className="header-card">
          <div className="header-gradient">
            <div className="header-content-flex">
              <div className="header-left">
                <div className="logo-badge">
                  <img
                    src="/logo.jpg"
                    alt="ATLANTIC ETUDES"
                    className="logo-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="logo-fallback">
                    <Building2 size={50} />
                  </div>
                </div>
                <div className="company-details">
                  <h1 className="company-brand">ATLANTIC ETUDES</h1>
                  <p className="company-tagline">Bureau d&apos;Études Techniques</p>
                  <div className="company-location">
                    <MapPin size={13} />
                    <span>Bd Mohamed Bouziane N° 162, Essalama 3, Casablanca</span>
                  </div>
                </div>
              </div>
              <div className="header-right">
                <div className="title-badge">
                  <Zap size={20} className="inline mr-1" />
                  Solution Rapide
                </div>
                <h2 className="main-title">Plateforme de Génération</h2>
                <p className="main-subtitle">Créez vos documents professionnels instantanément</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="left-column">
            <div className="card">
              <label className="card-label">
                <FileSpreadsheet size={24} />
                Type de document
              </label>
              <Select
                value={documentType}
                onValueChange={(value) => {
                  setDocumentType(value);
                  setFile(null);
                  setPreviewData(null);
                  setIsFileValid(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BCLG">📋 Bon de coulage (BCLG)</SelectItem>
                  <SelectItem value="ATT">✅ Attestation de conformité (ATT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {documentType === "BCLG" && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Upload size={22} />
                    Fichier Excel
                  </h3>
                  <button type="button" onClick={downloadBonTemplate} className="btn-template">
                    <FileDown size={18} />
                    Template Excel
                  </button>
                </div>
                <div className="upload-zone">
                  <Upload size={56} className="upload-icon" />
                  <h3 className="upload-title">{file ? "✅ " + file.name : "Charger le fichier Excel"}</h3>
                  <p className="upload-subtitle">Glissez-déposez ou cliquez pour sélectionner</p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    id="file-upload"
                    className="file-input"
                  />
                  <label htmlFor="file-upload" className="btn-upload">
                    📁 Choisir un fichier Excel
                  </label>
                </div>
                {file && (
                  <button
                    type="button"
                    onClick={handlePreview}
                    disabled={loading}
                    className="btn-preview"
                  >
                    <Eye size={20} />
                    {isFileValid ? "✅ Validé - Revoir" : "Valider les données"}
                  </button>
                )}
              </div>
            )}

            {documentType === "ATT" && (
              <div className="card">
                <div className="form-group">
                  <label className="input-label">
                    <Calendar size={20} />
                    Date de l&apos;attestation
                  </label>
                  <input
                    type="date"
                    value={projectInfo.date}
                    onChange={(e) => setProjectInfo({ ...projectInfo, date: e.target.value })}
                    className="date-input"
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">
                    <FileCheck size={20} />
                    Référence
                  </label>
                  <input
                    value={projectInfo.att_reference}
                    placeholder="MM/ATT/..."
                    onChange={(e) =>
                      setProjectInfo({ ...projectInfo, att_reference: e.target.value })
                    }
                    className="text-input"
                  />
                </div>
              </div>
            )}

            <div className="card">
              <h3 className="card-section-title">
                <Building2 size={22} />
                Informations du projet
              </h3>
              <div className="project-grid">
                {projectInputList.map((field) => {
                  const IconComponent = field.icon;
                  return (
                    <div key={field.key} className="form-group">
                      <label className="input-label-small">
                        <IconComponent size={16} />
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={projectInfo[field.key]}
                        onChange={(e) =>
                          setProjectInfo({ ...projectInfo, [field.key]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className="text-input-small"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="right-column">
            {previewData && previewData.length > 0 && (
              <div className="card">
                <h4 className="preview-title">
                  <Eye size={20} />
                  Aperçu Excel ({previewData.length} lignes)
                </h4>
                <div className="table-container">
                  <table className="preview-table">
                    <thead>
                      <tr>
                        {Object.keys(previewData[0])
                          .filter((k) => !k.startsWith("_"))
                          .map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, idx) => {
                        const keys = Object.keys(previewData[0]).filter((k) => !k.startsWith("_"));
                        return (
                          <tr key={idx}>
                            {keys.map((key) => (
                              <td key={key}>{row[key] != null ? String(row[key]) : ""}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="card">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={(documentType === "BCLG" && (!file || !isFileValid)) || loading}
                className="btn-generate"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Download size={24} />
                    Générer le PDF
                  </>
                )}
              </button>
              {documentType === "BCLG" && file && !isFileValid && (
                <div className="warning-message mt-3">
                  ⚠️ Cliquez sur &quot;Valider les données&quot; avant de générer le PDF
                </div>
              )}
            </div>

            <div className="card guide-card">
              <h4 className="guide-title">
                <Zap size={18} />
                Guide rapide
              </h4>
              <ul className="guide-list">
                <li><span>1</span> Sélectionnez le type de document</li>
                <li><span>2</span> Chargez votre fichier Excel (BCLG uniquement)</li>
                <li><span>3</span> Validez les données avec &quot;Aperçu&quot;</li>
                <li><span>4</span> Remplissez les informations du projet</li>
                <li><span>5</span> Générez votre PDF professionnel</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer">
          <p>© 2025 ATLANTIC ETUDES - Bureau d&apos;Études Techniques | Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}
