import React from 'react';

function Periode({
  Id,
  period,
  setPeriod,
  weekdayPrice,
  setWeekdayPrice,
  weekendPrice,
  setWeekendPrice,
  checkInTime,
  setCheckInTime,
  checkOutTime,
  setCheckOutTime,
  handleOptionCreate,
  handleOptionUpdate,
  handleDeleteOption,
  isUpdate = false, // Flag to determine if the component is in update mode
}) {
  return (
    


   

    <main className="container flex-grow p-4 sm:p-6">




        {/* <div class="mb-6 flex flex-col justify-between gap-y-1 sm:flex-row sm:gap-y-0">
          <h5>Profile</h5>

          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#">Users</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#">Profile</a>
            </li>
          </ol>
        </div> */}




        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

        

          <section className="col-span-1 flex w-full flex-1 flex-col gap-6 lg:col-span-3 lg:w-auto">
         

      


{/* FIRST USER INFO */}
            <div className="card period">
              <div className="card-body">
                <h1 className="text-[16px] font-semibold">{isUpdate ? period : "Ajouter une nouvelle période"}   </h1>
                <p className="mb-4 text-sm font-normal text-slate-400">Gérer vos informations </p>
                <form method="get" className="flex flex-col gap-5">

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="street-address">
                      <span className="my-1 block">Période</span>
                      <input
                        type="text"
                        placeholder='Nuit , Aprem ...'
                        className="input"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                       
                      />
                    </label>
                    {/* <label class="label" for="city-state">
                      <span class="my-1 block">City/State</span>
                      <input type="text" class="input" value="California" id="city-state" />
                    </label> */}
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="first-name">
                      <span className="my-1 block">Prix en semaine €</span>
                      <input type="text" className="input"  value={weekdayPrice}
                      onChange={(e) => setWeekdayPrice(e.target.value)}
                        />
                    </label>
                    <label className="label" for="last-name">
                      <span className="my-1 block">Prix du week-end €</span>
                      <input type="text" className="input" value={weekendPrice}
                       onChange={(e) => setWeekendPrice(e.target.value)}    />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="phone">
                      <span className="my-1 block">Heure d'arrivée</span>
                      <input type="text" className="input"  value={checkInTime}
                       onChange={(e) => setCheckInTime(e.target.value)} />
                    </label>
                    <label className="label" for="email">
                      <span className="my-1 block">Heure de départ</span>
                      <input type="text" className="input" value={checkOutTime}
          onChange={(e) => setCheckOutTime(e.target.value)}  />
                    </label>
                  </div>

                

                  {/* <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label class="label" for="country">
                      <span class="my-1 block">Country</span>
                      <input type="text" class="input" value="United States" id="country" />
                    </label>
                    <label class="label" for="zip-code">
                      <span class="my-1 block">Zip Code</span>
                      <input type="text" class="input" value="90011" id="zip-code" />
                    </label>
                  </div> */}
  <div className="flex items-center justify-end gap-4">
                    

                    {isUpdate ? (
         <span
         onClick={() => {
          handleDeleteOption(Id);
         }}
         className="btn border border-slate-300 "
        >
            Supprimer
        </span>
      ) : (
        <span>Cancel</span>
      )}

                    <span  className="btn btn-primary"> <span className='optionsUpCr'
          onClick={() => {
            if (isUpdate) {
              handleOptionUpdate({
                period,
                weekdayPrice,
                weekendPrice,
                checkInTime,
                checkOutTime,
              });
            } else {
              handleOptionCreate({
                period,
                weekdayPrice,
                weekendPrice,
                checkInTime,
                checkOutTime,
              });
            }
          }}
        >
          {isUpdate ? "Mettre à jour" : "Créer"}
        </span></span>
                  </div>
                </form>
              </div>
            </div>


        

         

          </section>

        </div>

       

      </main>
      
  );
}

export default Periode;
