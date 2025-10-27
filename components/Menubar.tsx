import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  menuTitle?: string;
};

const pad = (n: number) => n.toString().padStart(2, "0");

function formatDate(d: Date) {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const Menubar: React.FC<Props> = ({ menuTitle = "title" }) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{menuTitle}</Text>
      <View style={styles.right}> 
        <Text style={styles.date}>{formatDate(now)}</Text>
        <Text style={styles.time}>{formatTime(now)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  date: {
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  time: {
    fontSize: 14,
    color: "#333",
    fontVariant: ["tabular-nums"],
  },
});

export default Menubar;
