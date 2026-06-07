import { useMemo, useState } from "react";
import{
    apiBuild,
    Combination,
    CombinationType,
    updateApi_details,
    getApibyId,
    createApi_Details
    } from "./bot-config";
import CombinationPanel from "./combination-panel";

type ApiPanelProps = {
  Combinations: Combination[];
  apis: apiBuild[]
  onChange: (apis: apiBuild[]) => void;
  onNotify: (message: string, tone?: "success" | "error") => void;
  readOnly?: boolean;
};


export type Draft = {
  id: string | null;
  type: CombinationType;

  subtitle:string | null;
  text:string|null;
  //this will be used if the type is a photo or a link
  title:string | null;

  imageLinkWord:string|null;
};

const emptyDraft: Draft = {
  id: null,
  type: "" as CombinationType,
  subtitle: null,
  title: null,
  text: null,
  imageLinkWord: null,
}
export default function ApiPanel({
  Combinations,
  apis,
  onChange,
  onNotify,
  readOnly = false,
} :ApiPanelProps) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);



  const openEdit = (apiBuild: apiBuild) => {
    setDraft({
      id: apiBuild.id,
      type: apiBuild.type as CombinationType,
      subtitle: apiBuild.subtitle ?? null,
      text: apiBuild.text ?? null,
      title: apiBuild.title ?? null,
      imageLinkWord: apiBuild.imageLinkWord ?? null,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openCreate = (combination:Combination) => {
    if (readOnly) return;
    setDraft({
      id: combination.id,
      type: combination.type as CombinationType,
      subtitle: "",
      text: "",
      title: "",
      imageLinkWord: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

    const closeModal = () => {
    setIsModalOpen(false);
    setDraft(emptyDraft);
    setFormError("");
  };

    const handleSave = async () => {
    //   add validation here
  
      setSaving(true);
      try {
        if (draft.id) {
            await api = getApibyId(draft.id);
            if(api != null){
                await updateApi_details(
                    draft.id, {
                    type: draft.type as CombinationType,
                    title: draft.title.trim(),
                    subtitle:draft.subtitle.trim() ??  null,
                    text:draft.text.trim() ?? null,
                    imageLinkWord:draft.imageLinkWord.trim() ?? null
                    });
            }
        }
        else{
            await createApi_Details(
                draft.id, {
                type: draft.type as CombinationType,
                title: draft.title.trim(),
                subtitle:draft.subtitle.trim() ??  null,
                text:draft.text.trim() ?? null,
                imageLinkWord:draft.imageLinkWord.trim() ?? null
                } 
            
        }
        } else {
          throw Error('no id has been passed');
        }
        const refreshed = await fetchApiBuilds();
        onNotify(draft.id ? "Combination build updated." : "Combination created.");
        closeModal();
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : "Failed to save combination",
        );
      } finally {
        setSaving(false);
      }
    };

  // Component currently has no UI here; return null to satisfy TSX
  return null;
}
