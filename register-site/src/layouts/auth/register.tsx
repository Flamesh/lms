import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LoginType, registerApi } from "../../services/auth.service";
import { toast } from "react-toastify";
import { IconButton, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const defaultTheme = createTheme();

const api_url = process.env.REACT_APP_API_URL;

export default function SignIn() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = React.useState(false);
	const { t } = useTranslation();
	const [programList, setProgramList] = React.useState<any[]>([]);
	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.trim()
			.required(t("Username is required") as string)
			.matches(
				/^[a-zA-Z0-9]+$/,
				t("Username must contain only letters and numbers") as string
			)
			.min(6, t("Username must be at least 6 characters") as string)
			.max(20, t("Username must not exceed 20 characters") as string),
		full_name: Yup.string()
			.trim()
			.required(t("Full name is required") as string)
			.matches(
				/^[a-zA-Z0-9 ]+$/,
				t("Full name must contain only letters and numbers") as string
			),
		email: Yup.string()
			.trim()
			.required(t("Email is required") as string)
			.email(t("Email is invalid") as string),
		password: Yup.string()
			.trim()
			.required(t("Password is required") as string)
			.min(5, t("Password must be at least 5 characters") as string)
			.max(40, t("Password must not exceed 40 characters") as string),
		program_name: Yup.string().trim(),
	});

	const selectOptions = [
		{ value: 1, label: t("Teacher") },
		{ value: 2, label: t("Student") },
	];

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});
	const onSubmit = async (data: any) => {
		try {
			const dataSend = {
				username: String(data.username).trim(),
				email: String(data.email).trim(),
				password: String(data.password).trim(),
				program_name: String(data.program_name).trim(),
				full_name: String(data.full_name).trim(),
			};
			const response = await registerApi(dataSend);
			
			toast.success('Đăng ký thành công');
			setTimeout(() => { 
				window.location.href = api_url + ":8000";
			}, 2000);
			if (response === "Email_existed") {
				toast.error(t("Email already exists, please try another email"));
			}
			if (response === "Username_existed") {
				toast.error(t("Username existed, please try another username"));
			}
		} catch (error) {
			console.log("error", error);
			toast.error("Đăng ký không thành công, liện hệ admin để biết thêm chi tiết");
		}
	};
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const getListProgram = async () => {
		try {
			const response = await fetch(
				api_url + "/api/method/lms.lms.custom_api.program.get_program_list",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
						Accept: "application/json",
					},
				}
			);
			const res = await response.json();
			if (res.message) {
				setProgramList(res.message);
			}
		} catch (error) {
			const res_fake = {
				message: [
					{ name: "8A", code: null, description: null, title: "8A" },
					{ name: "7B", code: null, description: null, title: "7B" },
					{ name: "7A", code: null, description: null, title: "7A" },
					{ name: "6A", code: null, description: null, title: "6A" },
					{ name: "6D", code: null, description: null, title: "6D" },
					{ name: "6C", code: null, description: null, title: "6C" },
				],
			};
			setProgramList(res_fake.message);
		}
	};

	React.useEffect(() => {
		getListProgram();
	}, []);
	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			<Box
				sx={{
					margin: "0 auto",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					width: "50%",
					marginTop: "5%",
				}}
			>
				<Avatar
					style={{
						width: "100px",
						height: "100px",
						backgroundColor: "#adadad",
					}}
				>
					<img src={"/img/lms-logo.png"} width={50} height={50} />
				</Avatar>
				<Typography component="h1" variant="h5">
					{t("Sign up")}
				</Typography>

				<form
					style={{
						width: "80%", // Fix IE 11 issue.
						marginTop: defaultTheme.spacing(1),
					}}
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="form-group">
						<TextField
							margin="normal"
							type="text"
							fullWidth
							// id="user"
							label={"Tên đăng nhập"}
							// autoComplete="user"
							autoFocus
							{...register("username")}
							className={`form-control ${errors.username ? "is-invalid" : ""}`}
						/>
						<div className="invalid-feedback">{errors.username?.message}</div>
					</div>
					<div className="form-group">
						<TextField
							margin="normal"
							type="text"
							fullWidth
							id="user"
							label={"Họ và tên"}
							// autoComplete="user"
							autoFocus
							{...register("full_name")}
							className={`form-control ${errors.username ? "is-invalid" : ""}`}
						/>
						<div className="invalid-feedback">{errors.full_name?.message}</div>
					</div>

					<div className="form-group">
						<TextField
							margin="normal"
							type="text"
							fullWidth
							id="email"
							label={t("Email")}
							autoComplete="email"
							autoFocus
							{...register("email")}
							className={`form-control ${errors.username ? "is-invalid" : ""}`}
						/>
						<div className="invalid-feedback">{errors.email?.message}</div>
					</div>
					{/* <div className="form-group">
						<Select
							fullWidth
							native
							style={{ marginTop: "10px" }}
							{...register("role")}
						>
							{selectOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
						<div className="invalid-feedback">{errors.role?.message}</div>
					</div> */}
					<div className="form-group">
						<Select
							fullWidth
							native
							style={{ marginTop: "10px" }}
							{...register("program_name")}
						>
							{programList.map((option) => (
								<option key={option.value} value={option.value}>
									{option.title}
								</option>
							))}
						</Select>
						<div className="invalid-feedback">
							{errors.program_name?.message}
						</div>
					</div>
					<div className="form-group">
						<TextField
							margin="normal"
							fullWidth
							label={t("Password")}
							type={showPassword ? "text" : "password"}
							id="password"
							autoComplete="current-password"
							{...register("password")}
							InputProps={{
								endAdornment: (
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								),
							}}
						/>
						<div className="invalid-feedback">{errors.password?.message}</div>
					</div>

					<div className="">
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							{t("Sign up")}
						</Button>
					</div>
				</form>
			</Box>
		</ThemeProvider>
	);
}
