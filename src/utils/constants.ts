export interface AttributeDefinition {
    label: string;
    abbreviation: string;
}

export const ATTRIBUTE_CONFIG: Record<string, AttributeDefinition> = {
    str: { label: "Força", abbreviation: "FOR" },
    dex: { label: "Destreza", abbreviation: "DES" },
    con: { label: "Constituição", abbreviation: "CON" },
    int: { label: "Inteligência", abbreviation: "INT" },
    wis: { label: "Sabedoria", abbreviation: "SAB" },
    cha: { label: "Carisma", abbreviation: "CAR" }
};