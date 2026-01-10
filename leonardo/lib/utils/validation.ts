interface ObjValidationResult {
  isValid: boolean;
  message?: string;
  counts: {
    vertex: number;
    uv: number;
    normal: number;
    face: number;
    group: number;
    usemtl: number;
  };
}

const countMatches = ({
  inputString,
  regexPattern,
  regexModifier,
}: {
  inputString: string;
  regexPattern: string;
  regexModifier: string;
}) => {
  const regex = new RegExp(regexPattern, regexModifier);
  return ((inputString || "").match(regex) || []).length;
};

const getObjCounts = async (content: string) => {
  const counts: any = {};
  const patterns = [
    ["vertex", "\nv ", "g"],
    ["uv", "\nvt ", "g"],
    ["normal", "\nvn ", "g"],
    ["face", "\nf ", "g"],
    ["group", "\ng ", "g"],
    ["usemtl", "\nusemtl ", "g"],
  ];

  for (const [key, pattern, modifier] of patterns) {
    counts[key] = countMatches({
      inputString: content,
      regexPattern: pattern,
      regexModifier: modifier,
    });
  }
  return counts;
};

export const validateObj = async (file: File): Promise<ObjValidationResult> => {
  const content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

  const counts = await getObjCounts(content);
  const faces = content.match(/f .*/gm);

  if (!(faces || []).length) {
    return { isValid: false, message: "no faces specified", counts };
  }

  const faceData = (faces || [])
    .map((f) => f.replace(/f /, ""))
    .flatMap((f) => f.split(" "))
    .map((f) => f.split("/").map((i) => parseInt(i)));

  for (const indices of faceData) {
    if (indices.length > 3)
      return {
        isValid: false,
        message: "more than 3 integers detected for a face vertex",
        counts,
      };
    if (!indices.length)
      return { isValid: false, message: "face vertex missing", counts };

    if (indices[0] > counts.vertex)
      return {
        isValid: false,
        message: `out of bounds vertex specified ${indices[0]}`,
        counts,
      };
    if (indices[1] !== undefined && indices[1] > counts.uv)
      return {
        isValid: false,
        message: `out of bounds uv specified ${indices[1]}`,
        counts,
      };
    if (indices[2] !== undefined && indices[2] > counts.normal)
      return {
        isValid: false,
        message: `out of bounds normal specified ${indices[2]}`,
        counts,
      };
  }

  return { isValid: true, counts };
};
