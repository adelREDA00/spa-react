const URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : "https://spanode.onrender.com";

export async function register(data) {
    try {
        const response = await fetch(`${URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function login(data) {
    try {
        const response = await fetch(`${URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response;
    } catch (error) {
        console.log(error);
        throw error;  // Re-throw the error to be handled by the caller
    }
}


export async function getUser() {
    try {
        const response = await fetch(`${URL}/profile`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function logout() {
    try {
        await fetch(`${URL}/logout`, {
            credentials: "include",
        });
    } catch (error) {}
}

export async function uploadPhotoFromLink(data) {
    try {
        const response = await fetch(`${URL}/upload-by-link`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ link: data }),
        });

        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function uploadPhotoFromDevice(data) {
    const response = await fetch(`${URL}/upload`, {
        method: "POST",
        body: data,
    });
    
    
    return  response.json();
}

export async function createPlace(data) {
    try {
        const response = await fetch(`${URL}/add-place`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data }),
        });

        return response.json();
    } catch (error) {
        console.log(error);
    }
}


export async function getUserPlaces() {
    try {
        const response = await fetch(`${URL}/user-places`, {
            method: "GET",
            credentials: "include",
        });
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function getPlace(id) {
    try {
        const response = await fetch(`${URL}/place/` + id);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function updatePlace(id, data) {
    try {
        const response = await fetch(`${URL}/place/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, ...data }),
        });

        return response;
    } catch (error) {}
}

export async function getPlaces() {
    try {
        const response = await fetch(`${URL}/places`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function getPlacesIds() {
    try {
        const response = await fetch(`${URL}/placesIds`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function createBox(data) {
    try {
        const response = await fetch(`${URL}/add-box`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data }),
        });

        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function getBoxes() {
    try {
        const response = await fetch(`${URL}/box`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function updateBoxe(id, data) {
    try {
        const response = await fetch(`${URL}/box/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, ...data }),
        });

        return response.json();
    } catch (error) {}

}

export async function deletebox(id) {
    try {
        const response = await fetch(`${URL}/box/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getOptions() {
    try {
        const response = await fetch(`${URL}/options`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}




export async function createOption(data) {
    try {
        const response = await fetch(`${URL}/add-option`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data }),
        });

        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function updateOption(id, data) {
    try {
        const response = await fetch(`${URL}/options/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, ...data }),
        });

        return response.json();
    } catch (error) {}

}

export async function deleteOption(id) {
    try {
        const response = await fetch(`${URL}/options/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}


export async function bookPlace(id, data) {
    try {
        const response = await fetch(`${URL}/place/booking/${id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, ...data }),
        });

        return response.json;
    } catch (error) {
        console.log(error);
    }
}

export async function getBookings() {
    try {
        const response = await fetch(`${URL}/account/bookings`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function fetchBookedDates(placeId) {
    try {
      const response = await fetch(`${URL}/account/dates/${placeId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // data will include both fullyBookedDates and bookedSlots
    } catch (error) {
      console.error('Error fetching booked dates:', error);
      return { fullyBookedDates: [], bookedSlots: {} };
    }
  }
  

export async function deletePlace(id) {
    try {
        const response = await fetch(`${URL}/place/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getBookedPlace(id) {
    try {
        const response = await fetch(`${URL}/account/bookings/` + id, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function deleteBooking(id) {
    try {
        const response = await fetch(`${URL}/account/bookings/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}
