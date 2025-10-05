import * as React from "react";
import SettingsItem from "../../../components/SettingsItem";
import { z } from "zod";

export const settings_schema = z.object({
	system_prompt: z.string(),
	user_prompt: z.string(),
	temperature: z.number().optional(),
	top_p: z.number().optional(),
	presence_penalty: z.number().optional(),
	frequency_penalty: z.number().optional(),
	prompt_length: z.number().optional(),
});

export type Settings = z.infer<typeof settings_schema>;

const default_settings: Settings = {
	system_prompt: `### IMPORTANT

Give a short completion based on the context. Complete in the language of what the user uses. Write only the completion and nothing else. Do not include the user's text in your message. Only include the completion.

多使用 \\n 进行段落换行。

### Optional

LaTeX格式标准（当需要写出符号或公式时）

行内公式：$<expression>$

块级公式 (一定要在第一列，不能有任何缩进) ：

$$
<expression>  
$$

Output result only.`,
	user_prompt: "Continue the following:\n\n{{prefix}}",
};

export const parse_settings = (data: string | null): Settings => {
	if (data == null) {
		return default_settings;
	}
	try {
		const settings: unknown = JSON.parse(data);
		return settings_schema.parse(settings);
	} catch (e) {
		return default_settings;
	}
};

export function SettingsUI({
	settings,
	saveSettings,
}: {
	settings: string | null;
	saveSettings: (settings: string) => void;
}) {
	const parsed_settings = parse_settings(settings);

	return (
		<>
			<SettingsItem name="Rate limits" />
			<p>
				If you're getting rate limit errors, I can't really help. OpenAI
				doesn't like you using their API too much. You can either{" "}
				<a href="https://platform.openai.com/account/billing/overview">
					upgrade your plan
				</a>{" "}
				or set up a fallback preset. A fallback will be used while the
				plugin waits for the rate limit to reset; scroll down to the
				"Presets" section to set one up.
			</p>
			<SettingsItem name="System prompt" />
			<textarea
				className="ai-complete-chatgpt-full-width"
				value={parsed_settings.system_prompt}
				onChange={(e) =>
					saveSettings(
						JSON.stringify({
							...parsed_settings,
							system_prompt: e.target.value,
						})
					)
				}
			/>
			<SettingsItem name="User prompt" />
			<textarea
				className="ai-complete-chatgpt-full-width"
				value={parsed_settings.user_prompt}
				onChange={(e) =>
					saveSettings(
						JSON.stringify({
							...parsed_settings,
							user_prompt: e.target.value,
						})
					)
				}
			/>
			<SettingsItem name="Temperature">
				<input
					type="number"
					value={
						parsed_settings.temperature === undefined
							? ""
							: parsed_settings.temperature
					}
					onChange={(e) =>
						saveSettings(
							JSON.stringify({
								...parsed_settings,
								temperature: parseFloat(e.target.value),
							})
						)
					}
				/>
			</SettingsItem>
			<SettingsItem name="Top P">
				<input
					type="number"
					value={
						parsed_settings.top_p === undefined
							? ""
							: parsed_settings.top_p
					}
					onChange={(e) =>
						saveSettings(
							JSON.stringify({
								...parsed_settings,
								top_p: parseFloat(e.target.value),
							})
						)
					}
				/>
			</SettingsItem>
			<SettingsItem name="Presence penalty">
				<input
					type="number"
					value={
						parsed_settings.presence_penalty === undefined
							? ""
							: parsed_settings.presence_penalty
					}
					onChange={(e) =>
						saveSettings(
							JSON.stringify({
								...parsed_settings,
								presence_penalty: parseFloat(e.target.value),
							})
						)
					}
				/>
			</SettingsItem>
			<SettingsItem name="Frequency penalty">
				<input
					type="number"
					value={
						parsed_settings.frequency_penalty === undefined
							? ""
							: parsed_settings.frequency_penalty
					}
					onChange={(e) =>
						saveSettings(
							JSON.stringify({
								...parsed_settings,
								frequency_penalty: parseFloat(e.target.value),
							})
						)
					}
				/>
			</SettingsItem>
			<SettingsItem
				name="Prompt length"
				description={
					<>
						The length of both the prefix and the suffix of the
						prompt, in characters.
					</>
				}
			>
				<input
					type="number"
					value={
						parsed_settings.prompt_length === undefined
							? ""
							: parsed_settings.prompt_length
					}
					onChange={(e) =>
						saveSettings(
							JSON.stringify({
								...parsed_settings,
								prompt_length: parseInt(e.target.value),
							})
						)
					}
				/>
			</SettingsItem>
		</>
	);
}
