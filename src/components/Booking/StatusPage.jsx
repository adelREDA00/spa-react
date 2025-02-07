import React, { useEffect } from "react";

const StatusPage = () => {
  useEffect(() => {
    const detailsElements = document.querySelectorAll("details");

    const handleClick = (event) => {
      if (!event.shiftKey) {
        detailsElements.forEach((detail) => {
          if (detail !== event.currentTarget) {
            detail.removeAttribute("open");
          }
        });
      }
    };

    detailsElements.forEach((detail) => {
      detail.addEventListener("click", handleClick);
    });

    return () => {
      detailsElements.forEach((detail) => {
        detail.removeEventListener("click", handleClick);
      });
    };
  }, []);

  return (
    <div className="max-w-global mx-auto supp ">
    <h1 className="section-header"> RÈGLEMENT INTÉRIEUR</h1>
    <div className="statusPage">
      <div className="container">
       

        {/* Obligations */}
        <details>
          <summary className="success">Obligations</summary>
          <ul>
            <li>
              <div className="success">
                2 PERSONNES MAXIMUM (OBLIGATOIREMENT MAJEURS)
              </div>
            </li>
            <li>
              <div className="success">
                RESPECT DES HEURES ARRIVEES/DEPARTS
              </div>
            </li>
            <li>
              <div className="success">
                RESTITUTION DES CLÉS LE JOUR DU DEPART
              </div>
            </li>
            <li>
              <div className="success">EFFECTUER LA VAISSELLE</div>
            </li>
            <li>
              <div className="success">JETER LES POUBELLES</div>
            </li>
            <li>
              <div className="success">
                RESPECT DE L'ENSEMBLE DES DISPOSITIFS DE L'APPARTEMENT
              </div>
            </li>
          </ul>
        </details>

        {/* Interdictions */}
        <details>
          <summary className="warning">Interdictions</summary>
          <ul>
            <li>
              <div className="warning">
                DETERIORATION DU MATÉRIEL: (ÉLECTRONIQUE/IMMOBILIER/LINGE ET
                AUTRE)
              </div>
            </li>
            <li>
              <div className="warning">CONSOMMATION DANS LE SAUNA</div>
            </li>
            <li>
              <div className="warning">ANIMAL DE COMPAGNIE</div>
            </li>
            <li>
              <div className="warning">FÊTES ET ÉVÉNEMENTS</div>
            </li>
            <li>
              <div className="warning">FUMER</div>
            </li>
            <li>
              <div className="warning">
                MANIPULER LES DISPOSITIFS : DÉTECTEUR DE FUMEE, DÉTECTEUR DE
                MOUVEMENT, ALARME... ENTRAINERA UNE DEDUCTION IMMEDIATE DE 60 SUR
                LA CAUTION
              </div>
            </li>
            <li>
              <div className="warning">
                DEGRADER OU REPARTIR AVEC LA DECORATION MISE A DISPOSITION (UN
                INVENTAIRE SERA EFFECTUE AVANT ET APRES CHAQUE PASSAGE)
              </div>
            </li>
          </ul>
        </details>

        {/* Caution Warning */}
        <details open>
          <summary className="failure">Avertissement</summary>
          <ul>
            <li>
              <div className="failure">
                LE NON RESPECT DE CES RÈGLES ENTRAINERA L'ENCAISSEMENT DE LA
                CAUTION DE 200 €
              </div>
            </li>
          </ul>
        </details>
      </div>
    </div>
    </div>
  );
};

export default StatusPage;