import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { getAllLibraries } from "../../plex";
import CheckBoxOption from "../../components/settings/CheckBoxOption";
import { useUserSettings } from "../../states/UserSettingsState";

function SettingsLibraries() {
  const [libraries, setLibraries] = React.useState<Plex.LibarySection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { settings, setSetting } = useUserSettings();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const librariesData = await getAllLibraries();

        const filteredLibraries = librariesData.filter((lib) =>
          ["movie", "show"].includes(lib.type)
        );

        setLibraries(filteredLibraries);

        console.log("filteredLibraries", filteredLibraries);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h4">Experience - Libraries</Typography>

      <Box
        sx={{
          mt: 2,
          width: "100%",
          height: "40px",
          backgroundColor: "#181818",
          borderRadius: "10px",
        }}
      />

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <CheckBoxOption
          title="Disable Home Libraries Section"
          subtitle="Disables the section on the home screen where the libraries are displayed."
          checked={settings.DISABLE_HOME_SCREEN_LIBRARIES === "true"}
          onChange={() => {
            setSetting(
              "DISABLE_HOME_SCREEN_LIBRARIES",
              settings["DISABLE_HOME_SCREEN_LIBRARIES"] === "true"
                ? "false"
                : "true"
            );
          }}
        />

        <Divider sx={{ my: 2 }} />

        {loading && (
          <CircularProgress
            sx={{ alignSelf: "center", mt: 2 }}
            size={24}
          />
        )}

        {libraries.map((library) => {
          const key = `LIBRARY_${library.uuid}`;
          const rawValue = settings[key];

          const checked = rawValue === undefined ? true : rawValue === "true";

          return (
            <CheckBoxOption
              key={library.key}
              title={library.title}
              subtitle={`Type: ${library.type.toUpperCase()}`}
              checked={checked}
              onChange={() => {
                setSetting(key, checked ? "false" : "true");
              }}
            />
          );
        })}
      </Box>
    </>
  );
}
export default SettingsLibraries;
