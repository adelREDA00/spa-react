export async function register(data) {
    try {
        const response = await fetch(`/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function login(data) {
    try {
        const response = await fetch(`/api/login`, {
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
        throw error;
    }
}

export async function getUser() {
    try {
        const response = await fetch(`/api/profile`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user');
        }

        return response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function logout() {
    try {
        await fetch(`/api/logout`, {
            credentials: "include",
        });
    } catch (error) {}
}

export async function uploadPhotoFromLink(data) {
    try {
        const response = await fetch(`/api/upload-by-link`, {
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
    const response = await fetch(`/api/upload`, {
        method: "POST",
        body: data,
    });
    
    return response.json();
}

export async function createPlace(data) {
    try {
        const response = await fetch(`/api/add-place`, {
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
        const response = await fetch(`/api/user-places`, {
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
        const response = await fetch(`/api/place/` + id);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function updatePlace(id, data) {
    try {
        const response = await fetch(`/api/place/${id}`, {
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
        const response = await fetch(`/api/places`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function getPlacesIds() {
    try {
        const response = await fetch(`/api/placesIds`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function createBox(data) {
    try {
        const response = await fetch(`/api/add-box`, {
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
        const response = await fetch(`/api/box`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function updateBoxe(id, data) {
    try {
        const response = await fetch(`/api/box/${id}`, {
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
        const response = await fetch(`/api/box/${id}`, {
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
        const response = await fetch(`/api/options`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

export async function createOption(data) {
    try {
        const response = await fetch(`/api/add-option`, {
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
        const response = await fetch(`/api/options/${id}`, {
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
        const response = await fetch(`/api/options/${id}`, {
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
        const response = await fetch(`/api/place/booking/${id}`, {
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
        const response = await fetch(`/api/account/bookings`, {
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
      const response = await fetch(`/api/account/dates/${placeId}`, {
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
      return data;
    } catch (error) {
      console.error('Error fetching booked dates:', error);
      return { fullyBookedDates: [], bookedSlots: {} };
    }
}

export async function deletePlace(id) {
    try {
        const response = await fetch(`/api/place/${id}`, {
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
        const response = await fetch(`/api/account/bookings/` + id, {
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
        const response = await fetch(`/api/account/bookings/${id}`, {
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
