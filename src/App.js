import "./App.css";
import TextField from "@mui/material/TextField";

import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useState } from "react";

const Form = styled("form")`
  display: flex;
  flex-direction: column;
  min-width: 600px;
  margin-top: 20px;
`;

const FieldWrapper = styled("div")`
  margin-bottom: 15px;
  width: 100%;
  > div {
    width: 100%;
  }
`;

const StyledButton = styled(Button)`
  background: #8332a8;
  color: #fff;
`;

const validation = (data, setErrors) => {
  let errors = {};
  const isLatitude = (num) => !!num && isFinite(num) && Math.abs(num) <= 90;
  const isLongitude = (num) => !!num && isFinite(num) && Math.abs(num) <= 180;

  if (data.name.length < 2 || data.name.length >= 255) {
    errors.name = "Name should be between 2 and 255 charachters";
  }
  if (data.description.length < 20 || data.description.length >= 65535) {
    errors.description = "Description should be between 20 and 255 charachters";
  }
  if (data.address.length < 2 || data.address.length >= 255) {
    errors.address = "Address should be between 2 and 255 charachters";
  }
  if (data.address.length < 2 || data.address.length >= 255) {
    errors.address = "Address should be between 2 and 255 charachters";
  }
  if (!isLatitude(data.latitude)) {
    errors.latitude = "Invalid format";
  }
  if (!isLongitude(data.longitude)) {
    errors.longitude = "Invalid format";
  }
  setErrors(errors);
  if (Object.keys(errors).length > 0) {
    return false;
  }
  return true;
};

const initialData = {
  name: "",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
};

function App() {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState(initialData);
  const [selectedFile, setSelectedFile] = useState();
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    setIsSaving(true);
    const isValid = validation(formData, setErrors);

    if (isValid) {
      const mapPin = JSON.stringify({
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      const body = new FormData();
      body.append("map_pin", mapPin);
      body.append("name", formData.name);
      body.append("description", formData.description);
      body.append("address", formData.address);

      body.append("profile_pic", selectedFile);
      await fetch(
        "https://monkfish-app-n3daw.ondigitalocean.app/admin/venue/create",
        {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "*/*",
            //"Content-Type": "multipart/form-data",
            Authorization: `Bearer ${admin}`,
          },
          body: body,
        }
      );
    }
    setIsSaving(false);
  };

  const [val, setVal] = useState("");

  const onInputChange = (e) => {
    setVal((prev) => {
      if (e.target.value.length <= 2) {
        return e.target.value;
      }
      const sliced = e.target.value.split();
    });
  };

  const handleAdminSubmit = async () => {
    setIsSaving(true);
    await fetch("https://monkfish-app-n3daw.ondigitalocean.app/auth/login", {
      method: "POST",
      //mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user,
        password,
        user_type: "admin",
      }),
    })
      .then((res) => res.json())
      .then((response) => setAdmin(response.data.accessToken));
    setIsSaving(false);
  };

  return (
    <div className="App">
      {!admin ? (
        <Form onSubmit={handleAdminSubmit}>
          <h2>TUKA VENUE CREATE LOGIN</h2>
          <FieldWrapper>
            <TextField
              id="email"
              label="E-mail"
              variant="outlined"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </FieldWrapper>
          <StyledButton disabled={isSaving} onClick={handleAdminSubmit}>
            Submit
          </StyledButton>
        </Form>
      ) : (
        <Form onSubmit={handleSubmit}>
          <h2>TUKA VENUE CREATE</h2>
          <FieldWrapper>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              helperText={errors.name}
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="description"
              multiline
              minRows={4}
              label="Description"
              variant="outlined"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              error={errors.description}
              helperText={errors.description}
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="address"
              label="Address"
              variant="outlined"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={errors.address}
              helperText={errors.address}
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="latitude"
              label="Latitude"
              variant="outlined"
              value={formData.mapPin}
              onChange={(e) => handleChange("latitude", e.target.value)}
              error={errors.latitude}
              helperText={errors.latitude}
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="longitude"
              label="Longitude"
              variant="outlined"
              value={formData.mapPin}
              onChange={(e) => handleChange("longitude", e.target.value)}
              error={errors.longitude}
              helperText={errors.longitude}
            />
          </FieldWrapper>
          <FieldWrapper>
            <p>Venue pic</p>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </FieldWrapper>
          <StyledButton disabled={isSaving} onClick={handleSubmit}>
            Submit
          </StyledButton>
        </Form>
      )}
    </div>
  );
}

export default App;
