import React from "react";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdOutlineNotInterested } from "react-icons/md";


function InfoPlace() {

    return (

        <div className="max-w-global mx-auto supp ">
            <div className="mt-12">
                <h1 className="section-header"> RÈGLEMENT INTÉRIEUR</h1>
                {/* <p >  Nos Règles pour un Séjour Agréable</p> */}


                <div className="bg-gray-100  text-sm md:text-base px-2 md:px-6 py-4 mt-2">
                    <h3 className=" mb-2 sou-title">
                        <HiOutlineDocumentText size={20} />   Obligations
                    </h3>
                    <div className="mt-4">

                        <p className="text-base">
                            2 PERSONNES MAXIMUM (OBLIGATOIREMENT MAJEURS)
                        </p>

                    </div>
                    <div className="mt-4">
                        <p className=" text-base">
                            RESPECT DES HEURES ARRIVEES/DEPARTS
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className=" text-base">
                            RESTITUTION DES CLÉS LE JOUR DU DEPART
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className=" text-base">
                            EFFECTUER LA VAISSELLE


                        </p>
                    </div>
                    <div className="mt-4">
                        <p className=" text-base">
                            JETER LES POUBELLES
                        </p>
                    </div>

                    <div className="mt-4">
                        <p className="text-base">
                            RESPECT DE L'ENSEMBLE DES DISPOSITIFS DE L'APPARTEMENT


                        </p>
                    </div>
                </div>
                <br />

                <div className="bg-gray-100  text-sm md:text-base px-2 md:px-6 py-4 mt-2">
                    <h3 className="mb-2 sou-title">
                        <MdOutlineNotInterested size={20} />
                        Interdictions
                    </h3>
                    <div className="flex flex-row items-center text-gray-500">

                        <p className="mr-3">

                            DETERIORATION DU MATÉRIEL: (ÉLECTRONIQUE/   IMMOBILIER/LINGE ET AUTRE)


                        </p>


                    </div>
                    <div className="mt-4">

                        <p className="text-base">
                            CONSOMMATION DANS LE SAUNA
                        </p>
                    </div>
                    <div className="mt-4">

                        <p className="text-base">
                            ANIMAL DE COMPAGNIE
                        </p>
                    </div>
                    <div className="mt-4">

                        <p className="text-base">
                            FÊTES ET ÉVÉNEMENTS
                        </p>
                    </div>
                    <div className="mt-4">

                        <p className="text-base">
                            FUMER
                        </p>
                    </div>
                    <div className="mt-4">

                        <p className="text-base">
                            MANIPULER LES DISPOSITIFS : DÉTECTEUR DE FUMEE, DÉTECTEUR DE MOUVEMENT, ALARME...

                            ENTRAINERA UNE DEDUCTION IMMEDIATE DE 60 SUR LA CAUTION
                        </p>
                    </div>
                    <div className="mt-4">

                        <p className="text-base">
                            DEGRADER OU REPARTIR AVEC LA DECORATION MISE A DISPOSITION (UN INVENTAIRE SERA EFFECTUE AVANT ET APRES CHAQUE PASSAGE)
                        </p>
                    </div>


                    <div className="mt-4">
                        <hr />
                        <br />
                        <h6 className="text-base font-semibold">
                            LE NON RESPECT DE CES RÈGLES ENTRAINERA L'ENCAISSEMENT DE LA CAUTION DE 200 €
                        </h6>

                    </div>
                </div>


            </div>



            <div className="border-t-2 mt-6" />
        </div>
    );
}

export default InfoPlace;
